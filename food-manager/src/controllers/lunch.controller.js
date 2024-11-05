const prisma = require('../server/prisma');
const moment = require('moment');

async function renderHome(req, res) {
    try {
        const tipoUsuario = req.cookies['tipo_usuario'];
        const today = moment().format('YYYY-MM-DD'); // Format today's date

        const existingLunch = await prisma.Colacion.findFirst({
            where: {
                RutSolicitante: req.cookies["rutLogueado"] + "-" + req.cookies["dvLogueado"],
                FechaSolicitud: new Date(today) // Use formatted date
            },
        });

        if (existingLunch) {
            return res.render('lunch/home', { tipoUsuario: parseInt(tipoUsuario), Message: 'Ya has registrado una colación hoy', mostrarMenu: false });
        }
        return res.render('lunch/home', { tipoUsuario: parseInt(tipoUsuario), mostrarMenu: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function registrationLunch(req, res) {
    try {
        const { menu } = req.body;

        // Validate menu is a valid number
        if (!menu || isNaN(parseInt(menu))) {
            return res.status(400).json({ message: "Menu selection is invalid" });
        }

        const rutSolicitante = req.cookies["rutLogueado"] + "-" + req.cookies["dvLogueado"];
        const rut = req.cookies["rutLogueado"];
        const dv = req.cookies["dvLogueado"];
        
        const today = moment().format('YYYY-MM-DD');

        const existingLunch = await prisma.Colacion.findFirst({
            where: {
                RutSolicitante: rutSolicitante,
                FechaSolicitud: new Date(today)
            },
        });

        const funcionario = await prisma.Funcionario.findFirst({
            where: {
                RutFuncionario: rut,
                DvFuncionario: dv
            }
        });

        if (!funcionario) {
            return res.status(404).json({ message: "Funcionario not found" });
        }
        
        // Register the lunch
        const nuevaColacion = await prisma.Colacion.create({
            data: {
                RutSolicitante: rutSolicitante,
                FechaSolicitud: new Date(today),
                Menu: parseInt(menu),
                Estado: 0,
                TipoUnidad: {
                    connect: { IdTipoUnidad: funcionario.IdTipoUnidad } // Connect to existing TipoUnidad by Id
                }
            },
        });

        console.log('Emitting lunchRegistered event:', nuevaColacion);
        req.app.get('socketio').emit('/lunchRegistered', nuevaColacion);

        return res.status(200).json({ message: 'Colacion Ingresada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar la colación: ' + error);
    }
}


async function renderLunchList(req, res) {
    try {
        const tipoUsuario = req.cookies['tipo_usuario'];
        const today = moment().format('YYYY-MM-DD');
        const lunches = await prisma.Colacion.findMany({
            where: {
                FechaSolicitud: new Date(today),
                Estado: 0
            },
            orderBy: {
                FechaSolicitud: 'asc',
            },
        });
        res.render('totem/LunchList', { lunches, tipoUsuario: parseInt(tipoUsuario) });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el listado de colaciones');
    }
}


module.exports = {
    renderHome,
    registrationLunch,
    renderLunchList,
};
