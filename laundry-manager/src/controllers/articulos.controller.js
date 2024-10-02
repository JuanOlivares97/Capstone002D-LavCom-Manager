const prisma = require("../server/prisma");

async function renderHome(req, res) {
    try {
        const usuarios = await prisma.usuarios.findMany({
            where: {
                borrado: false,
            },
        });
        const servicios = await prisma.servicio.findMany();
        res.render("clothes/home", { usuarios, servicios });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getArticulos(req, res) {
    try {
        const articulos = await prisma.articulo.findMany({
            where: {
                borrado: false,
            },
            include: {
                subgrupo_ropa: true,
            },
        });
        return res.status(200).json(articulos);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function createArticulo(req, res) {
    try {
        const newArticulo = {
            nombre_articulo: req.body.nombre,
            stock: parseInt(req.body.stock),
            id_subgrupo_ropa: parseInt(req.body.subgrupo),
            borrado: false,
        };
        const articulo = await prisma.articulo.create({
            data: newArticulo,
        });
        if (!articulo) {
            return res.status(400).json({ message: "Error creating user" });
        }
        return res
            .status(201)
            .json({ message: "Articulo creado exitosamente" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server  error  " + error });
    }
}

async function updateArticulo(req, res) {
    try {
        const articulo = {
            nombre_articulo: req.body.nombre,
            stock: parseInt(req.body.stock),
            id_subgrupo_ropa: parseInt(req.body.subgrupo),
            borrado: false,
        };
        const articulos = await prisma.articulo.update({
            where: {
                id_articulo: parseInt(req.body.id_articulo),
            },
            data: articulo,
        });
        if (!articulos) {
            return res.status(400).json({ message: "Error updating user" });
        }

        return res
            .status(200)
            .json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error  " + error });
    }
}

async function deleteArticulo(req, res) {
    try {
        const articulo = await prisma.articulo.update({
            where: {
                id_articulo: parseInt(req.body.id_articulo),
            },
            data: {
                borrado: true,
            },
        });
        if (!articulo) {
            return res.status(400).json({ message: "Error deleting user" });
        }
        return res
            .status(200)
            .json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error  " + error });
    }
}

module.exports = {
    getArticulos,
    renderHome,
    createArticulo,
    updateArticulo,
    deleteArticulo,
};
