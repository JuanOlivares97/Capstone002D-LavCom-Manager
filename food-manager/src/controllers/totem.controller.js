const prisma = require('../server/prisma');
const moment = require('moment');


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
        const { rutSolicitante } = req.body;

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

        // Obtener la fecha de hoy en formato 'YYYY-MM-DD'
        const today = moment().format('YYYY-MM-DD');

        // Buscar la colación para el empleado en la fecha actual
        const colacion = await prisma.Colacion.findFirst({
            where: {
                RutSolicitante: rutSolicitante,
                FechaSolicitud: new Date(today)
            },
        });

        // Si no existe la colación, mostrar el menú
        if (!colacion) {
            return res.render('totem/home', { rutSolicitante, mostrarMenu: true, layout: false });
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
        return res.status(500).json({ message: 'Error al procesar el check-in' });
    }
}


async function registerLunchAtTotem(req, res) {
    try {
        const { rutSolicitante, menu } = req.body;

        // Verificar si ya registró colación hoy
        const today = moment().format('YYYY-MM-DD');
        let colacion = await prisma.Colacion.findFirst({
            where: {
                RutSolicitante: rutSolicitante,
                FechaSolicitud: new Date(today)
            },
        });

        if (colacion) {
            return res.render('totem/home', { errorMessage: 'Ya has registrado una colación hoy', mostrarMenu: false, layout: false });
        }
        const { rut, dv } = rutSolicitante.split('-');

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
                FechaSolicitud: new Date(),
                Menu: parseInt(menu),
                Estado: 1, // 0 - Solicitado, 1 - Confirmado, 2 - Retirado
                TipoUnidad: {
                    connect: { IdTipoUnidad: funcionario.IdTipoUnidad } // Connect to existing TipoUnidad by Id
                }
            },
        });
        const io = req.app.get('socketio');
        // Emitir evento al WebSocket
        req.app.get('socketio').of('/food-manager').emit('lunchRegistered', colacion);


        // Renderizar el ticket
        res.render('totem/ticket', { colacion, layout: false });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la colación en el tótem' });
    }
}

// Estado: 1 - Registrado, 2 - Retirado

module.exports = {
    renderTotem,
    checkInLunch,
    registerLunchAtTotem,
};