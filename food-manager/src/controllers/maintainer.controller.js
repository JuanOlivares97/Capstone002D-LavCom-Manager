const prisma = require('../server/prisma');

async function renderHome(req, res) {
    res.render('maintainer/home', { tipoUsuario: 1 });
}

async function getEstamento(req, res) {
    try {
        const Estamento = await prisma.TipoEstamento.findMany({
            where: {
                Habilitado: 'S'
            },
            
        });
        return Estamento;
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getServicio() {
    try {
        const servicios = await prisma.TipoServicio.findMany({
            where: {
                Habilitado: 'S'
            }
        });
        return servicios;
    } catch (error) {
        throw new Error("Error al obtener los servicios: " + error.message);
    }
}

async function getUnidad(req, res) {
    try {
        const Unidad = await prisma.TipoUnidad.findMany({
            where: {
                Habilitado: 'S'
            },
            
        });
        return Unidad;
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getVia(req, res) {
    try {
        const Via = await prisma.TipoVia.findMany({
            where: {
                Habilitado: 'S'
            },
            
        });
        return Via;
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getRegimen(req, res) {
    try {
        const Regimen = await prisma.TipoRegimen.findMany({
            where: {
                Habilitado: 'S'
            },
            
        });
        return Regimen;
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    renderHome,
    getEstamento,
    getServicio,
    getUnidad,
    getVia,
    getRegimen
}