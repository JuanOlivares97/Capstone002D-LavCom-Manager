const prisma = require('../server/prisma');
const { parse, format } = require('@formkit/tempo')

function renderTotem(req, res) {
    res.render('totem/home', {
        errorMessage: null,
        mostrarMenu: false,
        rutSolicitante: null,
        layout: false
    });
}

async function checkInLunch(req, res) {
    try {
        var { rutSolicitante } = req.body;
        rutSolicitante = rutSolicitante.trim().replace(/\s+/g, '');

        // Verificación del formato del RUT
        if (typeof rutSolicitante !== 'string' || !rutSolicitante.includes('-')) {
            return res.render('totem/home', { errorMessage: 'El rut solicitante no es válido', mostrarMenu: false, layout: false });
        }

        // Separación del RUT y DV
        const [rut, dv] = rutSolicitante.split('-');
        if (!rut || !dv) {
            return res.render('totem/home', { errorMessage: 'El rut solicitante no es válido', mostrarMenu: false, layout: false });
        }

        // Verificar si el empleado existe en la base de datos
        const empleado = await prisma.Funcionario.findUnique({
            where: {
                RutFuncionario_DvFuncionario: {
                    RutFuncionario: rut,
                    DvFuncionario: dv
                },
            }
        });

        if (!empleado || empleado.Habilitado !== 'S') {
            return res.render('totem/home', {
                errorMessage: 'Empleado no habilitado',
                mostrarMenu: false,
                rutSolicitante: null,
                layout: false
            });
        }

        // Obtener el inicio y fin del día actual en la zona horaria de Santiago usando Tempo.js
        const currentDate = format(new Date(), 'YYYY-MM-DD', 'cl'); // Fecha actual en formato YYYY-MM-DD

        // Buscar la colación para el empleado en la fecha actual
        const colacion = await prisma.Colacion.findFirst({
            where: {
                RutSolicitante: rutSolicitante.trim(),
                FechaSolicitud: currentDate,
            },
        });

        // Si no existe la colación, mostrar el menú
        if (!colacion) {
            return res.render('totem/home', { rutSolicitante, mostrarMenu: true, layout: false });
        }

        if (colacion.Estado === 1) {
            return res.render('404', { layout: false, message: 'Ya Solicitaste una colación' });
        }

        // Actualizar el estado de la colación a 1
        const newColacion = await prisma.Colacion.update({
            where: {
                IdColacion: colacion.IdColacion
            },
            data: {
                Estado: 1
            }
        });

        req.app.get('socketio').of('/food-manager').emit('lunchRegistered', newColacion);

        // Renderizar el ticket para la colación
        return res.render('totem/ticket', { colacion: newColacion, layout: false });

    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/totem/checkInLunch",
                codigo_http: 500
            }
        });
        return res.status(500).json({ message: 'Error al procesar el check-in: ' + error });
    }
}


async function registerLunchAtTotem(req, res) {
    try {
        const { rutSolicitante, menu } = req.body;

        // Inicio y fin del día en la zona horaria de Santiago
        const currentDate = format(new Date(), 'YYYY-MM-DD', 'cl');

        let colacion = await prisma.Colacion.findFirst({
            where: {
                RutSolicitante: rutSolicitante,
                FechaSolicitud: currentDate
            },
        });

        if (colacion) {
            return res.render('totem/home', { errorMessage: 'Ya has registrado una colación hoy', mostrarMenu: false, layout: false });
        }

        const [rut, dv] = rutSolicitante.split('-');

        const funcionario = await prisma.Funcionario.findFirst({
            where: {
                RutFuncionario: rut,
                DvFuncionario: dv
            }
        });

        // Registrar la colación
        colacion = await prisma.Colacion.create({
            data: {
                RutSolicitante: rutSolicitante,
                FechaSolicitud: currentDate,
                Menu: parseInt(menu),
                Estado: 1, // 0 - Solicitado, 1 - Confirmado, 2 - Retirado
                TipoUnidad: {
                    connect: { IdTipoUnidad: funcionario.IdTipoUnidad } // Connect to existing TipoUnidad by Id
                }
            },
        });

        req.app.get('socketio').of('/food-manager').emit('lunchRegistered', colacion);

        // Renderizar el ticket
        res.render('totem/ticket', { colacion, layout: false });
    } catch (error) {
        const error_log = await prisma.error_log.create({
            data: {
                id_usuario: null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/totem/registerLunchAtTotem",
                codigo_http: 500
            }
        });
        res.status(500).json({ message: 'Error al registrar la colación en el tótem' + error });
    }
}


module.exports = {
    renderTotem,
    checkInLunch,
    registerLunchAtTotem,
};
