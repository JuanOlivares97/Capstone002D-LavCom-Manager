const prisma = require('../server/prisma');
const bcrypt = require('bcryptjs');

async function getUsuarios(req, res) {
    try {
        const users = await prisma.usuarios.findMany({
            where: {
                borrado: false
            }
        });
        return res.json(users);
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
        const new_usuario = {
            id_usuario: null,
            rut_usuario: req.body.rut_usuario,
            dv_usuario: req.body.dv_usuario,
            nombre: req.body.nombre,
            id_servicio: req.body.id_servicio,
            id_tipo_contrato: req.body.id_tipo_contrato,   
            id_unidad_sigcom: req.body.id_unidad_sigcom,
            id_estamento: req.body.id_estamento,
            id_tipo_usuario: req.body.id_tipo_usuario,
            username: req.body.username,
            pwd: bcrypt.hashSync(req.body.pwd, 10),
            borrado: 0
        }
        const user = await prisma.usuarios.create({
            data: new_usuario
        });
        
        if (!user) {
            return res.status(400).json({ message: "Error creating user" });
        }

        return res.status(201).json({ message: "Usuario creado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function updateUsuario(req, res) {
    try {
        const usuario = {
            rut_usuario: req.body.rut_usuario,
            dv_usuario: req.body.dv_usuario,
            nombre: req.body.nombre,
            id_servicio: req.body.id_servicio,
            id_tipo_contrato: req.body.id_tipo_contrato,   
            id_unidad_sigcom: req.body.id_unidad_sigcom,
            id_estamento: req.body.id_estamento,
            id_tipo_usuario: req.body.id_tipo_usuario,
            username: req.body.username,
            pwd: bcrypt.hashSync(req.body.pwd, 10),
        }
        const user = await prisma.usuarios.update({
            where: {
                id_usuario: parseInt(req.params.id_usuario)
            },
            data: usuario
        });
        
        if (!user) {
            return res.status(400).json({ message: "Error updating user" });
        }

        return res.status(200).json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteUsuario(req, res) {
    try {
        const user = await prisma.usuarios.update({
            where: {
                id_usuario: parseInt(req.params.id_usuario)
            },
            data: {
                borrado: 1
            }
        });
        
        if (!user) {
            return res.status(400).json({ message: "Error deleting user" });
        }

        return res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function renderHome(req, res) {
    res.render('users/home')
}

module.exports = {
    getUsuarios,
    renderHome
}