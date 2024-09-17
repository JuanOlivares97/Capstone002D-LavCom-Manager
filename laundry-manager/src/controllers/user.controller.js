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
        console.log(error);
        
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getUsuarios
}