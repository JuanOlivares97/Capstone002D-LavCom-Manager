const prisma = require('../server/prisma');

// Renderiza la página principal del mantenedor
async function renderHome(req, res) {
    const Estamento = await getEstamento(); // Obtiene los estamentos desde la base de datos
    const servicios = await getServicio(); // Obtiene los servicios habilitados
    const Unidad = await getUnidad(); // Obtiene las unidades habilitadas
    const Via = await getVia(); // Obtiene las vías
    const Regimen = await getRegimen(); // Obtiene los regímenes habilitados
    const TipoFuncionario = await getTipoFuncionario(); // Obtiene los tipos de funcionario
    const Contrato = await getContrato(); // Obtiene los tipos de contrato
    const tipoUsuario = req.user.tipo_usuario; // Tipo de usuario desde las cookies

    // Renderiza la vista del mantenedor con los datos obtenidos
    res.render('maintainer/home', {
        tipoUsuario: parseInt(tipoUsuario),
        Estamento,
        servicios,
        Unidad,
        Via,
        Regimen,
        TipoFuncionario,
        Contrato
    });
}

// Obtiene todos los estamentos
async function getEstamento() {
    try {
        const Estamento = await prisma.TipoEstamento.findMany(); // Consulta todos los registros de TipoEstamento
        return Estamento;
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/maintainer/home",
                codigo_http: 500
            }
        });
        throw new Error("Error al obtener los Estamento: " + error.message);
    }
}

// Obtiene todos los servicios habilitados
async function getServicio() {
    try {
        const servicios = await prisma.TipoServicio.findMany({
            where: { Habilitado: 'S' } // Filtra solo los servicios habilitados
        });
        return servicios;
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/maintainer/home",
                codigo_http: 500
            }
        });
    }
}

// Obtiene todas las unidades habilitadas
async function getUnidad() {
    try {
        const Unidad = await prisma.TipoUnidad.findMany({
            where: { Habilitado: 'S' } // Filtra solo las unidades habilitadas
        });
        return Unidad;
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/maintainer/home",
                codigo_http: 500
            }
        });
    }
}

// Obtiene todas las vías
async function getVia() {
    try {
        const Via = await prisma.TipoVia.findMany(); // Consulta todos los registros de TipoVia
        return Via;
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/maintainer/home",
                codigo_http: 500
            }
        });
    }
}

// Obtiene todos los regímenes habilitados
async function getRegimen() {
    try {
        const Regimen = await prisma.TipoRegimen.findMany({
            where: { Habilitado: 'S' } // Filtra solo los regímenes habilitados
        });
        return Regimen;
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/maintainer/home",
                codigo_http: 500
            }
        });
    }
}

// Obtiene todos los tipos de funcionario
async function getTipoFuncionario() {
    try {
        const TipoFuncionario = await prisma.TipoFuncionario.findMany(); // Consulta todos los registros de TipoFuncionario
        return TipoFuncionario;
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/maintainer/home",
                codigo_http: 500
            }
        });
    }
}

// Obtiene todos los tipos de contrato
async function getContrato() {
    try {
        const Contrato = await prisma.TipoContrato.findMany(); // Consulta todos los registros de TipoContrato
        return Contrato;
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/maintainer/home",
                codigo_http: 500
            }
        });
    }
}

// Función genérica para crear un nuevo ítem
async function createItem(req, res, model, dataField) {
    try {
        const data = req.body[dataField]; // Obtiene el valor desde el cuerpo de la solicitud
        const item = await prisma[model].create({
            data: { [dataField]: data } // Crea un nuevo registro con el campo especificado
        });
        res.status(201).json(item); // Devuelve el registro creado
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/maintainer/home",
                codigo_http: 500
            }
        });
    }
}

// Funciones específicas para crear elementos llamando a la función genérica
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

// Función genérica para actualizar un ítem existente
async function updateItem(req, res, model, dataField, idField) {
    try {
        const data = req.body[dataField]; // Nuevo valor desde el cuerpo de la solicitud
        const existingItem = await prisma[model].findUnique({
            where: { [idField]: parseInt(req.params.id) } // Busca el ítem por ID
        });

        if (existingItem[dataField] === data) {
            const errorLog = await prisma.errorLog.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error interno del servidor",
                    mensaje_error: "El nuevo valor debe ser distinto al valor actual.",
                    ruta_error: "food-manager/maintainer/home",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ error: "El nuevo valor debe ser distinto al valor actual." });
        }

        const item = await prisma[model].update({
            where: { [idField]: parseInt(req.params.id) }, // Actualiza el ítem por ID
            data: { [dataField]: data }
        });
        res.status(200).json(item); // Devuelve el ítem actualizado
        } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/maintainer/home",
                codigo_http: 500
            }
        });
    }
}

// Funciones específicas para actualizar elementos llamando a la función genérica
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

// Función genérica para deshabilitar un ítem existente (soft delete)
async function deleteItem(req, res, model, idField) {
    try {
        const item = await prisma[model].update({
            where: { [idField]: parseInt(req.params.id) }, // Busca el ítem por ID
            data: { Habilitado: 'N' } // Cambia el estado a 'N'
        });
        res.status(200).json(item); // Devuelve el ítem deshabilitado
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/maintainer/home",
                codigo_http: 500
            }
        });
    }
}

// Funciones específicas para deshabilitar elementos llamando a la función genérica
async function deleteRegimen(req, res) {
    await deleteItem(req, res, 'TipoRegimen', 'IdTipoRegimen');
}

async function deleteService(req, res) {
    await deleteItem(req, res, 'TipoServicio', 'IdTipoServicio');
}

async function deleteUnidad(req, res) {
    await deleteItem(req, res, 'TipoUnidad', 'IdTipoUnidad');
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
};
