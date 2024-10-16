const prisma = require('../server/prisma');

async function renderHome(req, res) {
    res.render('maintainer/home', { tipoUsuario: 1 });
}

async function getEstamento() {
    try {
        const Estamento = await prisma.TipoEstamento.findMany({
            where: {
                Habilitado: 'S'
            },
            
        });
        return Estamento;
    } catch (error) {
        throw new Error("Error al obtener los Estamento: " + error.message);
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

async function getUnidad() {
    try {
        const Unidad = await prisma.TipoUnidad.findMany({
            where: {
                Habilitado: 'S'
            },
            
        });
        return Unidad;
    } catch (error) {
        throw new Error("Error al obtener los Unidad: " + error.message);
    }
}

async function getVia() {
    try {
        const Via = await prisma.TipoVia.findMany();
        return Via;
    } catch (error) {
        throw new Error("Error al obtener los Via: " + error.message);
    }
}

async function getRegimen() {
    try {
        const Regimen = await prisma.TipoRegimen.findMany({
            where: {
                Habilitado: 'S'
            },
            
        });
        return Regimen;
    } catch (error) {
        throw new Error("Error al obtener los Regimen: " + error.message);
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