const prisma = require('../server/prisma');

function showHome(req, res) {
    res.render('clothes/articulos')
}

async function getArticulos(req, res) {
    try {
        const articulos = await prisma.articulo.findMany({
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
    showHome
}