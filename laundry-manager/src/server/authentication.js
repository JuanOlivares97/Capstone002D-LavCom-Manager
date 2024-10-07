const jwt = require("jsonwebtoken");
const prisma = require("../server/prisma");

async function loginRequired(req, res, next) {
    try {
        const token = req.cookies["token"];
        if (!token) {
            return res.redirect("/auth/login");
        }

        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.redirect("/auth/login");
        }

        // Buscar el usuario en la base de datos
        const user = await prisma.usuarios.findUnique({
            where: { id_usuario: decoded.id_usuario }
        });

        if (!user) {
            return res.redirect("/auth/login");
        }

        req.user = user; // Añadir el usuario al objeto req
        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.status(401).json({ message: "Unauthorized access" });
    }
}

module.exports = {
    loginRequired
}