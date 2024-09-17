const prisma = require('../server/prisma');

async function renderHome(req, res) {
    try {
        const usuarios = await prisma.usuarios.findMany({
            where: {
                borrado: false
            }
        });
        res.render('clothes/articulos', { usuarios });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getArticulos(req, res) {
    try {
        const articulos = await prisma.articulo.findMany({
            where: {
                borrado: false
            },
            include: {
                subgrupo_ropa: true
            }
        });
        return res.status(200).json(articulos);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getArticulos,
    renderHome
}