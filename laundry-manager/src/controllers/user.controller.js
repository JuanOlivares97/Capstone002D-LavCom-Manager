const prisma = require('../server/prisma');

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

async function showHome(req, res) {
    res.render('users/home')
}

module.exports = {
    getUsuarios,
    showHome
}