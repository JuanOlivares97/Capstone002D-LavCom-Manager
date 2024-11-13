const jwt = require("jsonwebtoken");
const prisma = require("../server/prisma");

async function loginRequired(req, res, next) {
    try {
        const token = req.cookies["token"];
        if (!token) {
            return res.redirect("/food-manager/auth/login");
        }

        // Verificar el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.redirect("/food-manager/auth/login");
        }

        // Buscar el usuario en la base de datos
        const user = await prisma.Funcionario.findUnique({
            where: { IdFuncionario: decoded.id_usuario }
        });

        if (!user) {
            return res.redirect("/food-manager/auth/login");
        }

        req.user = user; // Añadir el usuario al objeto req
        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.redirect("/food-manager/auth/login");
    }
}

module.exports = {
    loginRequired
}