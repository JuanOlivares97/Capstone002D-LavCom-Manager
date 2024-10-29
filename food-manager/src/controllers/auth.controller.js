const prisma = require("../server/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../server/mailer")

function renderLogin(req, res) {
    try {
        return res.render("auth/login", { layout: false });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

function renderRecuperarContrasenaForm(req, res) {
    try {
        return res.render("auth/recuperar_pwd_form", { layout: false });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

function renderRecuperarContrasenaInfo(req, res) {
    try {
        return res.render("auth/recuperar_pwd_info", { layout: false });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    try {
        const { rutCompleto, pwd } = req.body;

        // Dividir el RUT en dos partes: número y dígito verificador
        const [RutFuncionario, DvFuncionario] = rutCompleto.split('-');

        // Ahora puedes usar RutFuncionario y DvFuncionario en tu consulta
        const user = await prisma.Funcionario.findFirst({
            where: {
                RutFuncionario: RutFuncionario,
                DvFuncionario: DvFuncionario
            }
        });

        if (!user) {
            return res.status(401).json({ message: "Rut o contraseña incorrectos", success: false });
        }

        const isPasswordValid = await bcrypt.compare(pwd, user.contrasena);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Rut o contraseña incorrectos", success: false });
        }

        const token_data = {
            id_usuario: user.IdFuncionario,
            rut: `${user.RutFuncionario}-${user.DvFuncionario}`,
            nombre: user.NombreFuncionario,
            tipo_usuario: user.IdTipoFuncionario
        }
        const token = jwt.sign(token_data, process.env.JWT_SECRET, { expiresIn: "8h" });

        res.cookie("token", token, { path: "/" });
        res.cookie("logged-in", true, { path: "/" });
        res.cookie("tipo_usuario", user.IdTipoFuncionario, { path: "/" });
        res.cookie("rutLogueado", user.RutFuncionario, { path: "/" });
        res.cookie("dvLogueado", user.DvFuncionario, { path: "/" });

        return res.status(200).json({ message: "Has iniciado sesión, bienvenido", success: true, user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function setEmail(req, res) {
    try {
        const email = req.body.email;
        const user = await prisma.usuarios.findUnique({ where: { IdFuncionario: req.body.IdFuncionario } });

        console.log(user);

        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado", success: false });
        }

        const updatedUser = await prisma.usuarios.update({
            where: { IdFuncionario: req.body.IdFuncionario },
            data: {
                email: email
            }
        });

        if (!updatedUser) {
            return res.status(500).json({ message: "Error al actualizar el correo electrónico", success: false });
        }

        return res.status(200).json({ message: "Correo electrónico establecido", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function sendPwdEmail(req, res) {
    try {
        const email = req.body.email;
        const rutCompleto = req.body.rutCompleto;
    
        const [RutFuncionario, DvFuncionario] = rutCompleto.split('-');

        const user = await prisma.Funcionario.findUnique({
            where: {
                RutFuncionario_DvFuncionario: {
                    RutFuncionario: RutFuncionario,
                    DvFuncionario: DvFuncionario
                }
            }
        });

        if (!user || user.correo !== email) {
            return res.status(500).json({ message: "Usuario no encontrado" });
        }

        const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        res.cookie("pwdcode", bcrypt.hashSync(code.toString(), 10), { path: "/" });
        res.cookie("username", rutCompleto, { path: "/" });

        await mailer.enviarCorreo(email, code.toString());

        return res.redirect("/auth/recuperar-pwd-info");
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}


async function changePwd(req, res) {
    try {
        const code = req.body.code
        const pwd = req.body.pwd

        const hashedCode = req.cookies.pwdcode

        if (!hashedCode) {
            return res.status(500).json({ success: false, message: "Código no encontrado" })
        }

        const isCodeValid = await bcrypt.compare(code, hashedCode)

        if (!isCodeValid) {
            return res.status(500).json({ success: false, message: "Código inválido, intente nuevamente" })
        }

        const hashedPwd = bcrypt.hashSync(pwd, 10)

        const rutCompleto = req.cookies["username"]
        const [RutFuncionario, DvFuncionario] = rutCompleto.split('-');

        await prisma.Funcionario.update({
            where: {
                RutFuncionario_DvFuncionario: {
                    RutFuncionario: RutFuncionario,
                    DvFuncionario: DvFuncionario
                }
            },
            data: {
                contrasena: hashedPwd
            }
        })

        return res.status(200).json({ success: true, message: "Contraseña actualizada" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error " + error, error: error.message })
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("token");
        res.clearCookie("logged-in");
        res.clearCookie("tipo_usuario");
        res.clearCookie("rutLogueado");
        res.clearCookie("dvLogueado");
        return res.status(200).json({ message: "Has cerrado sesión", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = {
    renderLogin,
    renderRecuperarContrasenaForm,
    renderRecuperarContrasenaInfo,
    login,
    logout,
    setEmail,
    sendPwdEmail,
    changePwd
}