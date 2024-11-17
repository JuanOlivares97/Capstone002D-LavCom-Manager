const prisma = require('../server/prisma');
const bcrypt = require('bcrypt');

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
            return res.status(404).json({ message: "No se encontraron usuarios" });
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getUsuario(req, res) {
    const { id_usuario } = req.params;
    try {
        const user = await prisma.usuarios.findUnique({
            where: {
                id_usuario: parseInt(id_usuario)
            }
        });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function createUsuario(req, res) {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.pwd, 10);
        const rut = req.body.rut_usuario.split('-')[0];
        const dv = req.body.rut_usuario.split('-')[1];

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
            return res.status(400).json({ message: "Error al crear usuario", success: false });
        }

        return res.status(200).json({ message: "Usuario creado exitosamente", success: true, user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function updateUsuario(req, res) {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.epwd, 10);
        const rut = req.body.erut_usuario.split('-')[0];
        const dv = req.body.erut_usuario.split('-')[1];
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
            return res.status(400).json({ message: "Error al actualizar el usuario", success: false });
        }

        return res.status(200).json({ message: "Usuario actualizado exitosamente", success: true, usuario_actualizado });
    } catch (error) {
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
    const tipo_user = req.user["tipo_usuario"];
    const servicios = await prisma.servicio.findMany();
    const estamentos = await prisma.estamento.findMany();
    const tipo_contrato = await prisma.tipo_contrato.findMany();
    const tipos_usuario = await prisma.tipo_usuario.findMany();
    res.status(200).render('users/home', {tipo_usuario: tipo_user, servicios, estamentos, tipo_contrato, tipos_usuario});
}

module.exports = {
    getUsuarios,
    renderHome,
    getUsuario,
    createUsuario,
    updateUsuario,
    deleteUsuario
}