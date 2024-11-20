const prisma = require("../server/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../server/mailer")

async function renderLogin(req, res) {
    try {
        return res.status(200).render("auth/login", {layout:false});
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/auth/login",
                codigo_http: 500
            },
        })
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function renderRecuperarContrasenaForm(req, res) {
    try {
        return res.status(200).render("auth/recuperar_pwd_form", {layout:false});
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/auth/recuperar-pwd-form",
                codigo_http: 500
            },
        })
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function renderRecuperarContrasenaInfo(req, res) {
    try {
        return res.status(200).render("auth/recuperar_pwd_info", {layout:false});
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/auth/recuperar-pwd-info",
                codigo_http: 500
            },
        })
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    try {
        const { username, pwd } = req.body;
        const user = await prisma.usuarios.findUnique({ where: { username } });

        if (!user) {
            await prisma.error_log.create({
                data: {
                    id_usuario: null,
                    tipo_error: "Error de inicio de sesión",
                    mensaje_error: "Usuario no encontrado",
                    ruta_error: "laundry-manager/auth/login",
                    codigo_http: 401
                },
            })
            return res.status(401).json({ message: "Usuario o contraseña incorrectos", success: false });
        }

        const isPasswordValid = await bcrypt.compare(pwd, user.pwd);

        if (!isPasswordValid) {
            await prisma.error_log.create({
                data: {
                    id_usuario: null,
                    tipo_error: "Error de inicio de sesión",
                    mensaje_error: "Contraseña incorrecta",
                    ruta_error: "laundry-manager/auth/login",
                    codigo_http: 401
                },
            })
            return res.status(401).json({ message: "Usuario o contraseña incorrectos", success: false });
        }

        const token_data = {
            id_usuario: user.id_usuario,
        }
        const token = jwt.sign(token_data, process.env.JWT_SECRET, { expiresIn: "8h" });

        let emailValidation = {
            hasEmail: true,
            id_usuario: user.id_usuario
        };
        if(user.email === null) {
            emailValidation.hasEmail = false;
        }

        res.cookie("token", token, { path: "/laundry-manager", httpOnly: true });
        return res.status(200).json({ message: "Has iniciado sesión, bienvenido", success: true, emailValidation });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/auth/login",
                codigo_http: 500
            },
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    } 
}

async function setEmail(req, res) {
    try {
        const email = req.body.email;
        const user = await prisma.usuarios.findUnique({ where: { id_usuario: req.body.id_usuario } });

        console.log(user);

        if (!user) {
            await prisma.error_log.create({
                data: {
                    id_usuario: null,
                    tipo_error: "Error de establecimiento de correo",
                    mensaje_error: "Usuario no encontrado",
                    ruta_error: "laundry-manager/auth/set-email",
                    codigo_http: 401
                },
            })
            return res.status(401).json({ message: "Usuario no encontrado", success: false });
        }

        const updatedUser = await prisma.usuarios.update({
            where: { id_usuario: req.body.id_usuario },
            data: {
                email: email
            }
        });

        if (!updatedUser) {
            await prisma.error_log.create({
                data: {
                    id_usuario: null,
                    tipo_error: "Error de establecimiento de correo",
                    mensaje_error: "Error al actualizar el correo electrónico",
                    ruta_error: "laundry-manager/auth/set-email",
                    codigo_http: 500
                },
            })
            return res.status(500).json({ message: "Error al actualizar el correo electrónico", success: false });
        }

        return res.status(200).json({ message: "Correo electrónico establecido", success: true });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/auth/set-email",
                codigo_http: 500
            },
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function sendPwdEmail(req, res) {
    try {
        const email = req.body.email
        const username = req.body.username

        const user = await prisma.usuarios.findUnique({
            where: {
                username: username,
                email: email
            }
        })

        if (!user) {
            await prisma.error_log.create({
                data: {
                    id_usuario: null,
                    tipo_error: "Error de correo para recuperación de contraseña",
                    mensaje_error: "Usuario no encontrado",
                    ruta_error: "laundry-manager/auth/send-pwd-mail",
                    codigo_http: 404
                },
            })
            return res.status(404).json({message: "Usuario no encontrado", success: false})
        }

        const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        res.cookie("pwdcode", bcrypt.hashSync(code.toString(), 10), {path: "/laundry-manager", httpOnly: true})
        res.cookie("username", username, {path: "/laundry-manager", httpOnly: true})

        await mailer.enviarCorreo(email, code.toString())

        return res.redirect("/laundry-manager/auth/recuperar-pwd-info")
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/auth/send-pwd-mail",
                codigo_http: 500
            },
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function changePwd(req, res) {
    try {
        const code = req.body.code
        const pwd = req.body.pwd

        const hashedCode = req.cookies.pwdcode

        if (!hashedCode) {
            await prisma.error_log.create({
                data: {
                    id_usuario: null,
                    tipo_error: "Error de recuperación de contraseña",
                    mensaje_error: "Código no encontrado",
                    ruta_error: "laundry-manager/auth/change-pwd",
                    codigo_http: 500
                },
            })
            return res.status(500).json({success: false, message: "Código no encontrado"})
        }

        const isCodeValid = await bcrypt.compare(code, hashedCode)

        if (!isCodeValid) {
            await prisma.error_log.create({
                data: {
                    id_usuario: null,
                    tipo_error: "Error de recuperación de contraseña",
                    mensaje_error: "Código inválido",
                    ruta_error: "laundry-manager/auth/change-pwd",
                    codigo_http: 500
                },
            })
            return res.status(500).json({success: false, message: "Código inválido, intente nuevamente"})
        }

        const hashedPwd = bcrypt.hashSync(pwd, 10)

        await prisma.usuarios.update({
            where: {
                username: req.cookies.username
            },
            data: {
                pwd: hashedPwd
            }
        })

        res.clearCookie("pwdcode", {path: "/laundry-manager"})
        res.clearCookie("username", {path: "/laundry-manager"})

        return res.status(200).json({success: true, message: "Contraseña actualizada"})
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/auth/change-pwd",
                codigo_http: 500
            },
        })
        return res.status(500).json({success: false, message: "Internal server error", error})
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("token", { path: '/laundry-manager' });
        return res.status(200).json({ message: "Has cerrado sesión", success: true });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/auth/logout",
                codigo_http: 500
            },
        })
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