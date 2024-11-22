const prisma = require('../server/prisma');
const bcrypt = require('bcrypt');
const {Fn} = require('../server/authentication');

// FUNCIÓN PARA OBTENER TODOS LOS USUARIOS
async function getUsuarios(req, res) {
    try {
        // Obtener todos los usuarios que no están marcados como "borrados"
        const users = await prisma.usuarios.findMany({
            where: {
                borrado: false // Solo obtener usuarios no borrados
            },
            select: {
                id_usuario: true, // Incluir ID de usuario
                rut_usuario: true, // Incluir RUT del usuario
                dv_usuario: true, // Incluir DV del RUT del usuario
                nombre: true, // Incluir nombre del usuario
                id_servicio: true, // Incluir ID de servicio asociado al usuario
                id_tipo_contrato: true, // Incluir ID de tipo de contrato
                id_estamento: true, // Incluir ID de estamento
                id_tipo_usuario: true, // Incluir ID de tipo de usuario
                username: true, // Incluir nombre de usuario
                email: true, // Incluir correo electrónico
                pwd: false // Excluir la contraseña del usuario
            }
        });

        // Si no se encuentran usuarios, registrar el error en el log de la base de datos
        if (users === null || users.length === 0) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                    tipo_error: "Error de base de datos", // Tipo de error
                    mensaje_error: "Error obteniendo usuarios", // Descripción del error
                    ruta_error: "laundry-manager/users/get-users", // Ruta donde ocurrió el error
                    codigo_http: 404 // Código HTTP correspondiente a no encontrar los usuarios
                }
            });
            // Retornar un error 404 indicando que no se encontraron usuarios
            return res.status(404).json({ message: "No se encontraron usuarios" });
        }

        // Si se encontraron usuarios, retornar los datos con un código HTTP 200
        return res.status(200).json(users);
    } catch (error) {
        // Si ocurre un error en el proceso, retornar un error 500 indicando un error interno del servidor
        return res.status(500).json({ message: "Internal server error" });
    }
}

// FUNCIÓN PARA CREAR USUARIO
async function createUsuario(req, res) {
    try {
        // Encriptar la contraseña usando bcrypt
        const hashedPassword = bcrypt.hashSync(req.body.pwd, 10);

        // Obtener RUT y DV (Dígito Verificador) del RUT ingresado
        const rut = req.body.rut_usuario.split('-')[0];
        const dv = req.body.rut_usuario.split('-')[1];

        // Validar el RUT usando una función externa (Fn.validaRut)
        const rutValid = Fn.validaRut(req.body.rut_usuario);
        
        // Si el RUT no es válido, registrar el error y retornar un mensaje de error 400
        if (!rutValid) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null, // ID del usuario que realiza la operación (si está disponible)
                    tipo_error: "Error de validación de rut", // Tipo de error
                    mensaje_error: `El rut ${req.body.rut_usuario} es inválido`, // Mensaje de error
                    ruta_error: "laundry-manager/users/create-user", // Ruta donde ocurrió el error
                    codigo_http: 400 // Código HTTP de error
                }
            });
            return res.status(400).json({ message: `El rut ${req.body.rut_usuario} es inválido`, success: false });
        }

        // Verificar si el RUT o el nombre de usuario ya están en uso
        const existingUser = await prisma.usuarios.findFirst({
            where: {
                OR: [
                    { rut_usuario: parseInt(rut) }, // Buscar si el RUT ya existe
                    { username: req.body.username } // Buscar si el nombre de usuario ya está registrado
                ]
            }
        });

        // Si ya existe un usuario con ese RUT o nombre de usuario, registrar el error y retornar un mensaje de error
        if (existingUser) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null, // ID del usuario que realiza la operación (si está disponible)
                    tipo_error: "Error de creación de usuario", // Tipo de error
                    mensaje_error: "El rut o el nombre de usuario ya estan en uso", // Mensaje de error
                    ruta_error: "laundry-manager/users/create-user", // Ruta donde ocurrió el error
                    codigo_http: 400 // Código HTTP de error
                }
            });
            return res.status(400).json({ message: "El rut o el nombre de usuario ya estan en uso, es posible que este usuario se encuentre deshabilitado, contacte al administrador", success: false });
        }

        // Crear un nuevo usuario en la base de datos
        const user = await prisma.usuarios.create({
            data: {
                rut_usuario: parseInt(rut), // Convertir RUT a entero
                dv_usuario: dv, // Asignar DV
                nombre: req.body.nombre, // Asignar nombre del usuario
                id_servicio: parseInt(req.body.servicio), // Asignar servicio
                id_tipo_contrato: parseInt(req.body.tipo_contrato), // Asignar tipo de contrato
                id_estamento: parseInt(req.body.estamento), // Asignar estamento
                id_tipo_usuario: parseInt(req.body.tipo_usuario), // Asignar tipo de usuario
                username: req.body.username, // Asignar nombre de usuario
                pwd: hashedPassword, // Asignar contraseña encriptada
                borrado: false // El usuario no está borrado (activo)
            },
            select: {
                id_usuario: true, // Incluir el ID de usuario
                rut_usuario: true, // Incluir el RUT
                dv_usuario: true, // Incluir el DV
                nombre: true, // Incluir nombre
                id_servicio: true, // Incluir servicio
                id_tipo_contrato: true, // Incluir tipo de contrato
                id_estamento: true, // Incluir estamento
                id_tipo_usuario: true, // Incluir tipo de usuario
                username: true, // Incluir nombre de usuario
                pwd: false // No incluir la contraseña en la respuesta
            }
        });

        // Si no se pudo crear el usuario, registrar el error y retornar un mensaje de error
        if (!user) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null, // ID del usuario que realiza la operación (si está disponible)
                    tipo_error: "Error de creación de usuario", // Tipo de error
                    mensaje_error: "Error al crear usuario", // Mensaje de error
                    ruta_error: "laundry-manager/users/create-user", // Ruta donde ocurrió el error
                    codigo_http: 400 // Código HTTP de error
                }
            });
            return res.status(400).json({ message: "Error al crear usuario", success: false });
        }

        // Retornar un mensaje de éxito con los datos del usuario creado
        return res.status(200).json({ message: "Usuario creado exitosamente", success: true, user });
    } catch (error) {
        // Si ocurre un error interno, registrar el error en el log y retornar un mensaje de error 500
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // ID del usuario que realiza la operación (si está disponible)
                tipo_error: "Error interno del servidor", // Tipo de error
                mensaje_error: JSON.stringify(error), // Mensaje de error detallado
                ruta_error: "laundry-manager/users/create-user", // Ruta donde ocurrió el error
                codigo_http: 500 // Código HTTP de error
            }
        });
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// FUNCION PARA ACTUALIZAR UN USUARIO
async function updateUsuario(req, res) {
    try {
        // Encriptar la nueva contraseña si es proporcionada
        const hashedPassword = bcrypt.hashSync(req.body.epwd, 10);

        // Separar RUT y DV
        const rut = req.body.erut_usuario.split('-')[0];
        const dv = req.body.erut_usuario.split('-')[1];

        // Validar el formato del RUT
        const rutValid = Fn.validaRut(req.body.erut_usuario);
        
        // Si el RUT es inválido, registrar el error y devolver un mensaje
        if (!rutValid) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,  // ID del usuario que realiza la acción
                    tipo_error: "Error de validación de rut",   // Tipo de error
                    mensaje_error: `El rut ${req.body.erut_usuario} es inválido`,  // Mensaje de error
                    ruta_error: "laundry-manager/users/update-user",  // Ruta donde ocurrió el error
                    codigo_http: 400  // Código de error HTTP
                }
            })
            return res.status(400).json({ message: `El rut ${req.body.erut_usuario} es inválido`, success: false });
        }

        // Verificar si el RUT, nombre de usuario o correo ya están en uso por otro usuario
        const existingUser = await prisma.usuarios.findFirst({
            where: {
                AND: [
                    {
                        OR: [
                            { rut_usuario: parseInt(rut) },  // Buscar por RUT
                            { username: req.body.eusername }, // Buscar por nombre de usuario
                            { email: req.body.eemail }        // Buscar por correo electrónico
                        ]
                    },
                    {
                        NOT: { id_usuario: parseInt(req.body.id_usuario) } // Excluir al usuario que está siendo actualizado
                    }
                ]
            }
        });

        // Si ya existe un usuario con el mismo RUT, username o email, registrar el error y devolver un mensaje
        if (existingUser) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,  // ID del usuario que realiza la acción
                    tipo_error: "Error de validación de rut",  // Tipo de error
                    mensaje_error: "El RUT, el email o el nombre de usuario ya estan en uso",  // Mensaje de error
                    ruta_error: "laundry-manager/users/update-user",  // Ruta donde ocurrió el error
                    codigo_http: 400  // Código de error HTTP
                }
            })
            return res.status(400).json({ 
                message: "El RUT, el email o el nombre de usuario ya están en uso por otro usuario, es posible que este usuario se encuentre deshabilitado, contacte al administrador", 
                success: false 
            });
        }

        // Datos a actualizar del usuario
        const usuario = {
            rut_usuario: parseInt(rut),    // RUT del usuario
            dv_usuario: dv,                // DV del usuario
            nombre: req.body.enombre,      // Nombre del usuario
            id_servicio: parseInt(req.body.eservicio),  // Servicio del usuario
            id_tipo_contrato: parseInt(req.body.etipo_contrato),   // Tipo de contrato
            id_estamento: parseInt(req.body.eestamento),  // Estamento del usuario
            id_tipo_usuario: parseInt(req.body.etipo_usuario),  // Tipo de usuario
            username: req.body.eusername,  // Nombre de usuario
            pwd: hashedPassword,           // Contraseña encriptada
            email: req.body.eemail         // Correo electrónico
        }

        // Actualización del usuario en la base de datos
        const usuario_actualizado = await prisma.usuarios.update({
            where: {
                id_usuario: parseInt(req.body.id_usuario)  // Identificador del usuario a actualizar
            },
            data: usuario  // Nuevos datos del usuario
        });
        
        // Si la actualización falla, registrar el error y devolver un mensaje
        if (!usuario_actualizado) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,  // ID del usuario que realiza la acción
                    tipo_error: "Error de base de datos",  // Tipo de error
                    mensaje_error: "Error al actualizar usuario",  // Mensaje de error
                    ruta_error: "laundry-manager/users/update-user",  // Ruta donde ocurrió el error
                    codigo_http: 400  // Código de error HTTP
                }
            })
            return res.status(400).json({ message: "Error al actualizar el usuario", success: false });
        }

        // Devolver una respuesta exitosa con los datos del usuario actualizado
        return res.status(200).json({ message: "Usuario actualizado exitosamente", success: true, usuario_actualizado });
    } catch (error) {
        // Si ocurre un error inesperado, registrar el error y devolver un mensaje
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,  // ID del usuario que realiza la acción
                tipo_error: "Error interno del servidor",  // Tipo de error
                mensaje_error: JSON.stringify(error),  // Mensaje de error con detalle
                ruta_error: "laundry-manager/users/update-user",  // Ruta donde ocurrió el error
                codigo_http: 500  // Código de error HTTP
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// FUNCIÓN PARA ELIMINAR UN USUARIO
async function deleteUsuario(req, res) {
    try {
        // Intentar actualizar el usuario marcando como 'borrado'
        const user = await prisma.usuarios.update({
            where: {
                id_usuario: parseInt(req.body.id_usuario)  // Buscar al usuario por su ID
            },
            data: {
                borrado: true  // Cambiar el campo 'borrado' a true para marcar al usuario como eliminado
            }
        });
        
        // Si no se encuentra el usuario o no se pudo actualizar, devolver un error
        if (!user) {
            return res.status(400).json({ message: "Error al eliminar usuario", success: false });
        }

        // Si la actualización fue exitosa, devolver una respuesta positiva
        return res.status(200).json({ message: "Usuario eliminado exitosamente", success: true });
    } catch (error) {
        // Si ocurre un error en el proceso, devolver un error interno
        return res.status(500).json({ message: "Internal server error", error, success: false });
    }
}

// FUNCIÓN PARA RENDERIZAR LA PÁGINA PRINCIPAL (HOME)
async function renderHome(req, res) {
    try {
        // Obtener el tipo de usuario del request
        const tipo_user = req.user["tipo_usuario"];

        // Obtener datos de las tablas 'servicio', 'estamento', 'tipo_contrato', y 'tipo_usuario' en la base de datos
        const servicios = await prisma.servicio.findMany();
        const estamentos = await prisma.estamento.findMany();
        const tipo_contrato = await prisma.tipo_contrato.findMany();
        const tipos_usuario = await prisma.tipo_usuario.findMany();

        // Renderizar la vista 'home' pasando los datos obtenidos y el tipo de usuario
        res.status(200).render('users/home', {
            tipo_usuario: tipo_user,
            servicios,
            estamentos,
            tipo_contrato,
            tipos_usuario
        });
    } catch (error) {
        // Si ocurre un error, registrar el error en la tabla de logs de errores
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,  // Guardar el id del usuario que hizo la solicitud, si está disponible
                tipo_error: "Error interno del servidor",  // Tipo de error
                mensaje_error: JSON.stringify(error),  // Convertir el error a un string para almacenarlo
                ruta_error: "laundry-manager/users/home",  // Ruta donde ocurrió el error
                codigo_http: 500  // Código HTTP para error interno
            }
        });

        // En caso de error, devolver una respuesta con código 500 y mensaje de error
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// EXPORTACIÓN DE FUNCIONES
module.exports = {
    getUsuarios,
    renderHome,
    createUsuario,
    updateUsuario,
    deleteUsuario
}