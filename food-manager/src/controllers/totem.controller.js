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
        if (typeof rutSolicitante !== 'string' || !rutSolicitante.includes('-')) {
            console.error('El rut solicitante no es válido');
            return res.render('totem/home', { errorMessage: 'El rut solicitante no es válido', mostrarMenu: false, layout: false });
        }

        // Dividir y verificar que ambos valores existan
        const [rut, dv] = rutSolicitante.split('-');
        if (!rut || !dv) {
            console.error('El rut solicitante no es válido');
            return res.render('totem/home', { errorMessage: 'El rut solicitante no es válido', mostrarMenu: false, layout: false });
        }

        // Verificar si el empleado existe
        const empleado = await prisma.Funcionario.findUnique({
            where: {
                RutFuncionario_DvFuncionario: {
                    RutFuncionario: rut,
                    DvFuncionario: dv
                },
            }
        });

        if (!empleado) {
            return res.render('totem/home', {
                errorMessage: 'Empleado no encontrado',
                mostrarMenu: false,
                rutSolicitante: null,
                layout:false
            });
        }

        
        const today = moment().format('YYYY-MM-DD'); // Format today's date

        const colacion = await prisma.Colacion.findFirst({
            where: {
                RutSolicitante: req.cookies["rutLogueado"] + "-" + req.cookies["dvLogueado"],
                FechaSolicitud: new Date(today) // Use formatted date
            },
        });

        if (colacion) {
            // Emitir evento al WebSocket
            req.app.get('socketio').emit('lunchRegistered', colacion);

            // Renderizar el ticket
            return res.render('totem/ticket', { colacion, layout:false });
        } else {
            // Permitir seleccionar menú
            res.render('totem/home', { rutSolicitante, mostrarMenu: true , layout:false});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar el check-in ' + error);
    }
}

async function registerLunchAtTotem(req, res) {
    try {
        const { rutSolicitante, menu } = req.body;

        // Verificar si ya registró colación hoy
        const todayStart = moment().startOf('day').toDate();
        let colacion = await prisma.colacion.findFirst({
            where: {
                RutSolicitante: rutSolicitante,
                FechaSolicitud: {
                    gte: todayStart,
                },
            },
        });

        if (colacion) {
            return res.render('totem/home', { errorMessage: 'Ya has registrado una colación hoy', mostrarMenu: false });
        }
        const { rut, dv } = rutSolicitante.split('-');

        const funcionario = await prisma.Funcionario.findFirst({
            where: {
                RutFuncionario: rut,
                dvFuncionario: dv
            }
        });
        // Registrar la colación
        colacion = await prisma.Colacion.create({
            data: {
                RutSolicitante: rutSolicitante,
                FechaSolicitud: new Date(),
                Menu: parseInt(menu),
                Estado: 0,
                IdTipoUnidad: funcionario.IdTipoUnidad
            },
        });

        // Emitir evento al WebSocket
        req.app.get('socketio').emit('lunchRegistered', colacion);

        
        // Renderizar el ticket
        res.render('totem/ticket', { colacion, layout: false });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar la colación en el tótem');
    }
}

// Estado: 1 - Registrado, 2 - Retirado

module.exports = {
    renderTotem,
    checkInLunch,
    registerLunchAtTotem,
};