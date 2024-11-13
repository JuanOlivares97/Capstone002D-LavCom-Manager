const prisma = require('../server/prisma');

async function renderHome(req, res) {
    const Estamento = await getEstamento();
    const servicios = await getServicio();
    const Unidad = await getUnidad();
    const Via = await getVia();
    const Regimen = await getRegimen();
    const TipoFuncionario = await getTipoFuncionario();
    const Contrato = await getContrato();
    const tipoUsuario = req.cookies['tipo_usuario']
    res.render('maintainer/home', { tipoUsuario: parseInt(tipoUsuario), Estamento, servicios, Unidad, Via, Regimen, TipoFuncionario, Contrato });
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

async function updateItem(req, res, model, dataField, idField) {
    try {
        const data = req.body[dataField];
        const existingItem = await prisma[model].findUnique({
            where: {
                [idField]: parseInt(req.params.id)
            }
        });

        if (existingItem[dataField] === data) {
            return res.status(400).json({ error: "El nuevo valor debe ser distinto al valor actual." });
        }

        const item = await prisma[model].update({
            where: {
                [idField]: parseInt(req.params.id)
            },
            data: {
                [dataField]: data
            }
        });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: `Error al actualizar el item: ${error.message}` });
    }
}

async function updateEstamento(req, res) {
    await updateItem(req, res, 'TipoEstamento', 'DescTipoEstamento', 'IdTipoEstamento');
}

async function updateService(req, res) {
    await updateItem(req, res, 'TipoServicio', 'DescTipoServicio', 'IdTipoServicio');
}

async function updateUnidad(req, res) {
    await updateItem(req, res, 'TipoUnidad', 'DescTipoUnidad', 'IdTipoUnidad');
}

async function updateVia(req, res) {
    await updateItem(req, res, 'TipoVia', 'DescTipoVia', 'IdTipoVia');
}

async function updateTipoRegimen(req, res) {
    await updateItem(req, res, 'TipoRegimen', 'DescTipoRegimen', 'IdTipoRegimen');
}

async function updateTipoFuncionario(req, res) {
    await updateItem(req, res, 'TipoFuncionario', 'TipoPerfil', 'IdTipoFuncionario');
}

async function updateContrato(req, res) {
    await updateItem(req, res, 'TipoContrato', 'TipoContrato', 'IdTipoContrato');
}

async function deleteItem(req, res, model, idField) {
    try {
        const item = await prisma[model].update({
            where: {
                [idField]: parseInt(req.params.id)
            },
            data: {
                Habilitado: 'N'
            }
        });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: `Error al actualizar el item: ${error.message}` });
    }
}

async function deleteRegimen(req, res) {
    await deleteItem(req, res, 'TipoRegimen','IdTipoRegimen');
}

async function deleteService(req, res) {
    await deleteItem(req, res, 'TipoServicio','IdTipoServicio');
}

async function deleteUnidad(req, res) {
    await deleteItem(req, res, 'TipoUnidad','IdTipoUnidad');
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
    createService,
    updateEstamento,
    updateService,
    updateUnidad,
    updateVia,
    updateTipoRegimen,
    updateTipoFuncionario,
    updateContrato,
    deleteRegimen,
    deleteService,
    deleteUnidad,
}