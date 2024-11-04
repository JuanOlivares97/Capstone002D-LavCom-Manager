const prisma = require('../server/prisma');
const moment = require('moment');

async function renderHome(req, res) {
    try {
        const tipoUsuario = req.cookies['tipo_usuario']
        return res.render('lunch/home', { tipoUsuario: parseInt(tipoUsuario), errorMessage: null,
            mostrarMenu: false, successMessage: null });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function registrationLunch(req, res) {
    try {
        const { menu } = req.body;
        const rutSolicitante = req.cookies["rutLogueado"] + "-" + req.cookies["dvLogueado"];
        const rut = req.cookies["rutLogueado"]// Asumiendo que el middleware JWT agrega el RUT del usuario al objeto req.user
        const dv = req.cookies["dvLogueado"]
        // Verificar si ya registró una colación hoy
        const todayStart = moment().startOf('day').toDate();
        const existingLunch = await prisma.Colacion.findFirst({
            where: {
                RutSolicitante: rutSolicitante,
                FechaSolicitud: {
                    gte: todayStart,
                },
            },
        });

        const funcionario = await prisma.Funcionario.findFirst({
            where: {
                    RutFuncionario: rut,
                    DvFuncionario: dv
            }
        });
        // Registrar la colación
        const nuevaColacion = await prisma.Colacion.create({
            data: {
                RutSolicitante: rutSolicitante,
                FechaSolicitud: new Date(),
                Menu: parseInt(menu),
                Retirado: 0,
                IdTipoUnidad: funcionario.IdTipoUnidad // Ajusta según corresponda
            },
        });

        // Emitir evento al WebSocket
        req.app.get('socketio').emit('lunchRegistered', nuevaColacion);

        res.render('lunch/home', { successMessage: 'Colación registrada exitosamente', errorMessage:null, tipoUsuario:1 });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar la colación');
    }
}

function renderTotem(req, res) {
    res.render('lunch/totem', {
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
            return res.render('lunch/totem', { errorMessage: 'El rut solicitante no es válido', mostrarMenu: false, layout: false });
        }

        // Dividir y verificar que ambos valores existan
        const [rut, dv] = rutSolicitante.split('-');
        if (!rut || !dv) {
            console.error('El rut solicitante no es válido');
            return res.render('lunch/totem', { errorMessage: 'El rut solicitante no es válido', mostrarMenu: false, layout: false });
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
            return res.render('lunch/totem', {
                errorMessage: 'Empleado no encontrado',
                mostrarMenu: false,
                rutSolicitante: null,
                layout:false
            });
        }

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
            // Actualizar el estado de 'Retirado' si no lo ha hecho
            if (colacion.Retirado === 0) {
                colacion = await prisma.colacion.update({
                    where: { IdColacion: colacion.IdColacion },
                    data: { Retirado: 1 },
                });
            }
            // Emitir evento al WebSocket
            req.app.get('socketio').emit('lunchRegistered', colacion);

            // Renderizar el ticket
            return res.render('lunch/ticket', { colacion, layout:false });
        } else {
            // Permitir seleccionar menú
            res.render('lunch/totem', { rutSolicitante, mostrarMenu: true , layout:false});
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
            return res.render('lunch/totem', { errorMessage: 'Ya has registrado una colación hoy', mostrarMenu: false });
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
                Retirado: 1,
                IdTipoUnidad: funcionario.IdTipoUnidad // Ajusta según corresponda
            },
        });

        // Emitir evento al WebSocket
        req.app.get('socketio').emit('lunchRegistered', colacion);

        
        // Renderizar el ticket
        res.render('lunch/ticket', { colacion, layout: false });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar la colación en el tótem');
    }
}

async function renderLunchList(req, res) {
    try {
        const todayStart = moment().startOf('day').toDate();
        const lunches = await prisma.Colacion.findMany({
            where: {
                FechaSolicitud: {
                    gte: todayStart,
                },
            },
            orderBy: {
                FechaSolicitud: 'asc',
            },
        });
        res.render('lunch/lunchlist', { lunches, layout: false });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el listado de colaciones');
    }
}


module.exports = {
    renderHome,
    registrationLunch,
    renderTotem,
    checkInLunch,
    registerLunchAtTotem,
    renderLunchList,
};
