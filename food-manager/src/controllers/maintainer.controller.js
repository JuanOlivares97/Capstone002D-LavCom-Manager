const prisma = require('../server/prisma');

async function renderHome(req, res) {
    const Estamento = await getEstamento();
    const servicios = await getServicio();
    const Unidad = await getUnidad();
    const Via = await getVia(); 
    const Regimen = await getRegimen();
    const TipoFuncionario = await getTipoFuncionario();
    const Contrato = await getContrato();

    res.render('maintainer/home', { tipoUsuario: 1, Estamento, servicios, Unidad, Via, Regimen, TipoFuncionario, w });
}

async function getEstamento() {
    try {
        const Estamento = await prisma.TipoEstamento.findMany();
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

async function getTipoFuncionario() {
    try {
        const TipoFuncionario = await prisma.TipoFuncionario.findMany();
        return TipoFuncionario;
    } catch (error) {
        throw new Error("Error al obtener los TipoFuncionario: " + error.message);
    }
}

async function getContrato() {
    try {
        const Contrato = await prisma.TipoContrato.findMany();
        return Contrato;
    } catch (error) {
        throw new Error("Error al obtener los Contrato: " + error.message);
    }
}


module.exports = {
    renderHome,
    getEstamento,
    getServicio,
    getUnidad,
    getVia,
    getRegimen,
    getTipoFuncionario,
    getContrato
}