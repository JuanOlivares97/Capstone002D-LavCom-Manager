const prisma = require('../server/prisma');
const moment = require('moment');

// Renderiza la página principal de colaciones
async function renderHome(req, res) {
    try {
        const tipoUsuario = req.user.tipo_usuario; // Obtiene el tipo de usuario desde las cookies
        const today = moment().format('YYYY-MM-DD'); // Formatea la fecha actual (YYYY-MM-DD)

        // Verifica si el usuario ya registró una colación hoy
        const existingLunch = await prisma.Colacion.findFirst({
            where: {
                RutSolicitante: req.cookies["rutLogueado"] + "-" + req.cookies["dvLogueado"], // Combina el RUT y DV del usuario
                FechaSolicitud: new Date(today), // Compara con la fecha de hoy
            },
        });

        // Si ya existe una colación, muestra un mensaje y oculta el menú
        if (existingLunch) {
            return res.render('lunch/home', { tipoUsuario: parseInt(tipoUsuario), Message: 'Ya has registrado una colación hoy', mostrarMenu: false });
        }

        // Si no existe, muestra el menú
        return res.render('lunch/home', { tipoUsuario: parseInt(tipoUsuario), mostrarMenu: true });
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/lunch/home",
                codigo_http: 500
            }
        });
        // Manejo de errores
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Registra una nueva colación
async function registrationLunch(req, res) {
    try {
        const { menu } = req.body; // Obtiene el menú seleccionado desde el cuerpo de la solicitud

        // Valida que el menú sea un número válido
        if (!menu || isNaN(parseInt(menu))) {
            const errorLog = await prisma.errorLog.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error interno del servidor",
                    mensaje_error: JSON.stringify(error),
                    ruta_error: "food-manager/lunch/home",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ message: "Menu selection is invalid" });
        }

        const rutSolicitante = req.cookies["rutLogueado"] + "-" + req.cookies["dvLogueado"]; // Combina el RUT y DV del usuario
        const rut = req.cookies["rutLogueado"];
        const dv = req.cookies["dvLogueado"];
        const today = moment().format('YYYY-MM-DD'); // Formatea la fecha actual (YYYY-MM-DD)

        // Verifica si el funcionario está habilitado
        const funcionario = await prisma.Funcionario.findFirst({
            where: {
                RutFuncionario: rut,
                DvFuncionario: dv,
            },
        });

        if (!funcionario || funcionario.Habilitado !== 'S') {
            const errorLog = await prisma.errorLog.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error interno del servidor",
                    mensaje_error: JSON.stringify(error),
                    ruta_error: "food-manager/lunch/home",
                    codigo_http: 404
                }
            });
            return res.status(404).json({ message: "Funcionario no habilitado" });
        }

        // Registra la nueva colación
        const nuevaColacion = await prisma.Colacion.create({
            data: {
                RutSolicitante: rutSolicitante, // RUT completo del solicitante
                FechaSolicitud: new Date(today), // Fecha de solicitud
                Menu: parseInt(menu), // Menú seleccionado
                Estado: 0, // Estado inicial: 0 - Solicitado
                TipoUnidad: {
                    connect: { IdTipoUnidad: funcionario.IdTipoUnidad }, // Conecta con la unidad del funcionario
                },
            },
        });

        // Devuelve un mensaje de éxito
        return res.status(200).json({ message: 'Colacion ingresada exitosamente' });
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/lunch/home",
                codigo_http: 500
            }
        });
        // Manejo de errores
        console.error(error);
        res.status(500).send('Error al registrar la colación: ' + error);
    }
}

// Renderiza el listado de colaciones confirmadas
async function renderLunchList(req, res) {
    try {
        const tipoUsuario = req.user.tipo_usuario; // Obtiene el tipo de usuario desde las cookies
        const today = moment().format('YYYY-MM-DD'); // Formatea la fecha actual (YYYY-MM-DD)

        // Obtiene las colaciones confirmadas para hoy
        const lunches = await prisma.Colacion.findMany({
            where: {
                FechaSolicitud: new Date(today), // Fecha de solicitud es hoy
                Estado: 1, // Estado 1 - Confirmado
            },
            orderBy: {
                FechaSolicitud: 'asc', // Ordena por fecha ascendente
            },
        });

        // Renderiza la vista con la lista de colaciones
        res.render('totem/LunchList', { lunches, tipoUsuario: parseInt(tipoUsuario) });
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/lunch/home",
                codigo_http: 500
            }
        });
        res.status(500).send('Error al cargar el listado de colaciones');
    }
}

// Registra una colación como retirada
async function registrarColacionRetirada(req, res) {
    const idColacion = req.params.id; // Obtiene el ID de la colación desde los parámetros
    const today = moment().format('YYYY-MM-DD'); // Formatea la fecha actual (YYYY-MM-DD)

    try {
        // Verifica si existe una colación con el ID y la fecha de hoy
        const existingLunch = await prisma.Colacion.findFirst({
            where: {
                IdColacion: parseInt(idColacion),
                FechaSolicitud: new Date(today),
            },
        });

        // Si no existe, devuelve un error 404
        if (!existingLunch) {
            return res.status(404).json({ message: "Colación no encontrada" });
        }

        // Actualiza el estado de la colación a 2 (Retirada)
        await prisma.Colacion.update({
            where: {
                IdColacion: parseInt(idColacion),
            },
            data: {
                Estado: 2, // Estado actualizado a "Retirada"
            },
        });

        // Devuelve un mensaje de éxito
        return res.status(200).json({ message: 'Colación retirada exitosamente' });
    } catch (error) {
        const errorLog = await prisma.errorLog.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/lunch/home",
                codigo_http: 500
            }
        });
        return res.status(500).json({ message: 'Error al retirar la colación' });
    }
}

module.exports = {
    renderHome, // Renderiza la página principal de colaciones
    registrationLunch, // Registra una nueva colación
    renderLunchList, // Renderiza el listado de colaciones
    registrarColacionRetirada, // Marca una colación como retirada
};
