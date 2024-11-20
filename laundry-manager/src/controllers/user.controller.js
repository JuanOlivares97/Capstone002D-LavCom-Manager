const prisma = require('../server/prisma');
const bcrypt = require('bcrypt');
const {Fn} = require('../server/authentication');

async function getUsuarios(req, res) {
    try {
        const users = await prisma.usuarios.findMany({
            where: {
                borrado: false
            },
            select: {
                id_usuario: true,
                rut_usuario: true,
                dv_usuario: true,
                nombre: true,
                id_servicio: true,
                id_tipo_contrato: true,
                id_unidad_sigcom: true,
                id_estamento: true,
                id_tipo_usuario: true,
                username: true,
                email: true,
                pwd: false
            }
        });

        if (users === null || users.length === 0) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de base de datos",
                    mensaje_error: "Error obteniendo usuarios",
                    ruta_error: "laundry-manager/users/get-users",
                    codigo_http: 404
                }
            })
            return res.status(404).json({ message: "No se encontraron usuarios" });
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function createUsuario(req, res) {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.pwd, 10);
        const rut = req.body.rut_usuario.split('-')[0];
        const dv = req.body.rut_usuario.split('-')[1];

        const rutValid = Fn.validaRut(req.body.rut_usuario);
        
        if (!rutValid) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de validación de rut",
                    mensaje_error: `El rut ${req.body.rut_usuario} es inválido`,
                    ruta_error: "laundry-manager/users/create-user",
                    codigo_http: 400
                }
            })
            return res.status(400).json({ message: `El rut ${req.body.rut_usuario} es inválido`, success: false });
        }

        const existingUser = await prisma.usuarios.findFirst({
            where: {
                OR: [
                    { rut_usuario: parseInt(rut) },
                    { username: req.body.username }
                ]
            }
        });

        if (existingUser) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de creación de usuario",
                    mensaje_error: "El rut o el nombre de usuario ya estan en uso",
                    ruta_error: "laundry-manager/users/create-user",
                    codigo_http: 400
                }
            })
            return res.status(400).json({ message: "El rut o el nombre de usuario ya estan en uso, es posible que este usuario se encuentre deshabilitado, contacte al administrador", success: false });
        }

        const user = await prisma.usuarios.create({
            data: {
                rut_usuario: parseInt(rut),
                dv_usuario: dv,
                nombre: req.body.nombre,
                id_servicio: parseInt(req.body.servicio),
                id_tipo_contrato: parseInt(req.body.tipo_contrato),
                id_unidad_sigcom: null,
                id_estamento: parseInt(req.body.estamento),
                id_tipo_usuario: parseInt(req.body.tipo_usuario),
                username: req.body.username,
                pwd: hashedPassword,
                borrado: false
            },
            select: {
                id_usuario: true,
                rut_usuario: true,
                dv_usuario: true,
                nombre: true,
                id_servicio: true,
                id_tipo_contrato: true,
                id_unidad_sigcom: true,
                id_estamento: true,
                id_tipo_usuario: true,
                username: true,
                pwd: false
            }
        });

        if (!user) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de creación de usuario",
                    mensaje_error: "Error al crear usuario",
                    ruta_error: "laundry-manager/users/create-user",
                    codigo_http: 400
                }
            })
            return res.status(400).json({ message: "Error al crear usuario", success: false });
        }

        return res.status(200).json({ message: "Usuario creado exitosamente", success: true, user });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/users/create-user",
                codigo_http: 500
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function updateUsuario(req, res) {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.epwd, 10);
        const rut = req.body.erut_usuario.split('-')[0];
        const dv = req.body.erut_usuario.split('-')[1];

        const rutValid = Fn.validaRut(req.body.erut_usuario);
        
        if (!rutValid) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de validación de rut",
                    mensaje_error: `El rut ${req.body.erut_usuario} es inválido`,
                    ruta_error: "laundry-manager/users/update-user",
                    codigo_http: 400
                }
            })
            return res.status(400).json({ message: `El rut ${req.body.erut_usuario} es inválido`, success: false });
        }

        const existingUser = await prisma.usuarios.findFirst({
            where: {
                AND: [
                    {
                        OR: [
                            { rut_usuario: parseInt(rut) },
                            { username: req.body.eusername },
                            { email: req.body.eemail }
                        ]
                    },
                    {
                        NOT: { id_usuario: parseInt(req.body.id_usuario) } // Asegurarse de que no es el mismo usuario
                    }
                ]
            }
        });

        // Si se encuentra un usuario existente, se devuelve un error
        if (existingUser) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de validación de rut",
                    mensaje_error: "El RUT, el email o el nombre de usuario ya estan en uso",
                    ruta_error: "laundry-manager/users/update-user",
                    codigo_http: 400
                }
            })
            return res.status(400).json({ 
                message: "El RUT, el email o el nombre de usuario ya están en uso por otro usuario, es posible que este usuario se encuentre deshabilitado, contacte al administrador", 
                success: false 
            });
        }

        const usuario = {
            rut_usuario: parseInt(rut),
            dv_usuario: dv,
            nombre: req.body.enombre,
            id_servicio: parseInt(req.body.eservicio),
            id_tipo_contrato: parseInt(req.body.etipo_contrato),   
            // id_unidad_sigcom: req.body.id_unidad_sigcom,
            id_estamento: parseInt(req.body.eestamento),
            id_tipo_usuario: parseInt(req.body.etipo_usuario),
            username: req.body.eusername,
            pwd: hashedPassword,
            email: req.body.eemail
        }
        const usuario_actualizado = await prisma.usuarios.update({
            where: {
                id_usuario: parseInt(req.body.id_usuario)
            },
            data: usuario
        });
        
        if (!usuario_actualizado) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de base de datos",
                    mensaje_error: "Error al actualizar usuario",
                    ruta_error: "laundry-manager/users/update-user",
                    codigo_http: 400
                }
            })
            return res.status(400).json({ message: "Error al actualizar el usuario", success: false });
        }

        return res.status(200).json({ message: "Usuario actualizado exitosamente", success: true, usuario_actualizado });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/users/update-user",
                codigo_http: 500
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function deleteUsuario(req, res) {
    try {
        const user = await prisma.usuarios.update({
            where: {
                id_usuario: parseInt(req.body.id_usuario)
            },
            data: {
                borrado: true
            }
        });
        
        if (!user) {
            return res.status(400).json({ message: "Error al eliminar usuario", success: false });
        }

        return res.status(200).json({ message: "Usuario eliminado exitosamente", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error, success: false });
    }
}

async function renderHome(req, res) {
    try {
        const tipo_user = req.user["tipo_usuario"];
        const servicios = await prisma.servicio.findMany();
        const estamentos = await prisma.estamento.findMany();
        const tipo_contrato = await prisma.tipo_contrato.findMany();
        const tipos_usuario = await prisma.tipo_usuario.findMany();
        res.status(200).render('users/home', {tipo_usuario: tipo_user, servicios, estamentos, tipo_contrato, tipos_usuario});
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/users/home",
                codigo_http: 500
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = {
    getUsuarios,
    renderHome,
    createUsuario,
    updateUsuario,
    deleteUsuario
}