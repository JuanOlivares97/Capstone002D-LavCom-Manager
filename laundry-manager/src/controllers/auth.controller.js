const prisma = require("../server/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function renderLogin(req, res) {
    try {
        return res.render("auth/login", {layout:false});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

function renderRecuperarContrasenaForm(req, res) {
    try {
        return res.render("auth/recuperar_pwd_form", {layout:false});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

function renderRecuperarContrasenaInfo(req, res) {
    try {
        return res.render("auth/recuperar_pwd_info", {layout:false});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    try {
        const { username, pwd } = req.body;
        const user = await prisma.usuarios.findUnique({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos", success: false });
        }

        const isPasswordValid = await bcrypt.compare(pwd, user.pwd);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos", success: false });
        }

        const token_data = {
            rut: `${user.rut_usuario}-${user.dv_usuario}`,
            nombre: user.nombre,
            tipo_usuario: user.id_tipo_usuario
        }
        const token = jwt.sign(token_data, process.env.JWT_SECRET, { expiresIn: "8h" });

        res.cookie("token", token, { path: "/" });
        res.cookie("logged-in", true, { path: "/" });

        return res.status(200).json({ message: "Has iniciado sesión, bienvenido", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    } 
}

module.exports = {
    renderLogin,
    renderRecuperarContrasenaForm,
    renderRecuperarContrasenaInfo,
    login
}