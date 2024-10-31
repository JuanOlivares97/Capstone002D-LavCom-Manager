const prisma = require('../server/prisma');

async function renderHome(req, res) {
    const Estamento = await getEstamento();
    const servicios = await getServicio();
    const Unidad = await getUnidad();
    const Via = await getVia(); 
    const Regimen = await getRegimen();
    const TipoFuncionario = await getTipoFuncionario();
    const Contrato = await getContrato();

    res.render('maintainer/home', { tipoUsuario: 1, Estamento, servicios, Unidad, Via, Regimen, TipoFuncionario, Contrato });
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

async function createItem(req, res, model, dataField) {
    try {
        const data = req.body[dataField];
        const item = await prisma[model].create({
            data: {
                [dataField]: data
            }
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ error: `Error al crear el item: ${error.message}` });
    }
}

// Wrappers para llamar a la función genérica con los parámetros adecuados
async function createEstamento(req, res) {
    await createItem(req, res, 'TipoEstamento', 'DescTipoEstamento');
}

async function createService(req, res) {
    await createItem(req, res, 'TipoServicio', 'DescTipoServicio');
}

async function createUnidad(req, res) {
    await createItem(req, res, 'TipoUnidad', 'DescTipoUnidad');
}

async function createVia(req, res) {
    await createItem(req, res, 'TipoVia', 'DescTipoVia');
}

async function createTipoRegimen(req, res) {
    await createItem(req, res, 'TipoRegimen', 'DescTipoRegimen');
}

async function createTipoFuncionario(req, res) {
    await createItem(req, res, 'TipoFuncionario', 'TipoPerfil');
}

async function createContrato(req, res) {
    await createItem(req, res, 'TipoContrato', 'TipoContrato');
}

module.exports = {
    renderHome,
    getEstamento,
    getServicio,
    getUnidad,
    getVia,
    getRegimen,
    getTipoFuncionario,
    getContrato,
    createEstamento,
    createUnidad,
    createVia,
    createTipoFuncionario,
    createContrato,
    createTipoRegimen,
    createService
}