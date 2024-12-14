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

        req.user = {
            id_usuario: user.IdFuncionario,
            nombre: user.NombreFuncionario,
            tipo_usuario: user.IdTipoFuncionario,
            email: user.correo,
            rutLogueado: user.RutFuncionario,
            DvLogueado: user.DvFuncionario,
            
        }; // Añadir el usuario al objeto req
        next();
    } catch (error) {
        console.error("Error during authentication:", error);
        return res.redirect("/food-manager/auth/login");
    }
}

// Función para verificar el rol del usuario
function rolesAllowed(roles) {
    return (req, res, next) => {
        try {
            const role = req.user.tipo_usuario;
            
            if (!roles.includes(role)) {
                return res.status(403).render("404", {layout: false, message: "No tienes suficientes permisos para acceder a esta ruta"});
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = {
    loginRequired,
    rolesAllowed
}