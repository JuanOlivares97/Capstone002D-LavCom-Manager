const prisma = require("../server/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../server/mailer");

// Renderiza la página de inicio de sesión
async function renderLogin(req, res) {
    try {
        return res.render("auth/login", { layout: false }); // Renderiza la vista sin layout
    } catch (error) {
        const error_log = await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error de renderizado",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/auth/login",
                codigo_http: 500
            }
        });
        return res.status(500).json({ message: "Internal server error" }); // Manejo de errores
    }
}

// Renderiza el formulario de recuperación de contraseña
async function renderRecuperarContrasenaForm(req, res) {
    try {
        return res.render("auth/recuperar_pwd_form", { layout: false }); // Renderiza la vista sin layout
    } catch (error) {
        const error_log = await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error de renderizado",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/auth/login",
                codigo_http: 500
            }
        }); 
        return res.status(500).json({ message: "Internal server error" }); // Manejo de errores
    }
}

// Renderiza la página de información de recuperación de contraseña
async function renderRecuperarContrasenaInfo(req, res) {
    try {
        return res.render("auth/recuperar_pwd_info", { layout: false }); // Renderiza la vista sin layout
    } catch (error) {
        const error_log = await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error de renderizado",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/auth/login",
                codigo_http: 500
            }
        });
        return res.status(500).json({ message: "Internal server error" }); // Manejo de errores
    }
}

// Autenticación de usuarios
async function login(req, res) {
    try {
        const { username, pwd } = req.body;

        // Busca al usuario en la base de datos incluyendo su tipo de funcionario
        const user = await prisma.Funcionario.findFirst({
            where: {
                username: username
            },
            include: {
                TipoFuncionario: true // Relación con el tipo de funcionario
            }
        });

        if (!user || !user.contrasena) {
            return res.status(401).json({ message: "Rut o contraseña incorrectos", success: false }); // Validación de usuario
        }

        // Compara la contraseña ingresada con el hash almacenado
        const isPasswordValid = await bcrypt.compare(pwd, user.contrasena);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Rut o contraseña incorrectos", success: false }); // Contraseña incorrecta
        }

        // Genera un hash para el nombre del usuario
        if (!user.NombreFuncionario) {
            return res.status(500).json({ message: "Error: Nombre de usuario no disponible", success: false });
        }
        const hashName = await bcrypt.hash(user.NombreFuncionario, 10);

        // Crea un token JWT con información del usuario
        const token_data = {
            id_usuario: user.IdFuncionario,
            nombre: hashName,
        };
        const token = jwt.sign(token_data, process.env.JWT_SECRET, { expiresIn: "8h" });

        // Establece cookies para autenticación
        res.cookie("token", token, { path: "/food-manager", httpOnly: true, sameSite: "Strict" });

        return res.status(200).json({ message: "Has iniciado sesión, bienvenido", success: true, user });
    } catch (error) {
        const error_log = await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error de autenticación",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/auth/login",
                codigo_http: 500
            }
        });
        return res.status(500).json({ message: "Internal server error", success: false }); // Manejo de errores
    }
}

// Establece el correo electrónico de un usuario
async function setEmail(req, res) {
    try {
        const email = req.body.email;

        // Busca al usuario por ID
        const user = await prisma.Funcionario.findUnique({ where: { IdFuncionario: req.body.IdFuncionario } });

        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado", success: false }); // Validación de usuario
        }

        // Actualiza el correo del usuario
        const updatedUser = await prisma.Funcionario.update({
            where: { IdFuncionario: req.body.IdFuncionario },
            data: {
                correo: email
            }
        });

        if (!updatedUser) {
            return res.status(500).json({ message: "Error al actualizar el correo electrónico", success: false });
        }

        return res.status(200).json({ message: "Correo electrónico establecido", success: true });
    } catch (error) {
        const error_log = await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error al actualizar el correo electrónico",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/auth/login",
                codigo_http: 500
            }
        });
        return res.status(500).json({ message: "Internal server error " + error, success: false }); // Manejo de errores
    }
}

// Envía un correo con un código de recuperación de contraseña
async function sendPwdEmail(req, res) {
    try {
        const email = req.body.email;
        const rutCompleto = req.body.rutCompleto;

        // Divide el RUT en número y dígito verificador
        const [RutFuncionario, DvFuncionario] = rutCompleto.split('-');

        // Busca al usuario por RUT
        const user = await prisma.Funcionario.findUnique({
            where: {
                RutFuncionario_DvFuncionario: {
                    RutFuncionario: RutFuncionario,
                    DvFuncionario: DvFuncionario,
                },
            },
        });

        if (!user || user.correo !== email) {
            return res.status(500).json({ message: "Usuario no encontrado" }); // Validación del usuario
        }

        // Genera un código aleatorio de 4 dígitos
        const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        // Hashea el código para mayor seguridad
        const hashedCode = bcrypt.hashSync(code.toString(), 10);

        // Guarda el código y el RUT en cookies
        res.cookie("pwdcode", hashedCode, { path: "/food-manager", httpOnly: true, sameSite: "Strict" });
        res.cookie("username", rutCompleto, { path: "/food-manager", httpOnly: true, sameSite: "Strict" });

        // Envía el correo con el código
        await mailer.enviarCorreo(email, code.toString());

        return res.redirect("/food-manager/auth/recuperar-pwd-info");
    } catch (error) {
        const error_log = await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error al enviar el correo electrónico",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/auth/login",
                codigo_http: 500
            }
        });
        return res.status(500).json({ message: "Internal server error", error: error.message }); // Manejo de errores
    }
}

// Cambia la contraseña del usuario
async function changePwd(req, res) {
    try {
        const code = req.body.code;
        const pwd = req.body.pwd;

        // Recupera el código hasheado de las cookies
        const hashedCode = req.cookies.pwdcode;

        if (!hashedCode) {
            return res.status(500).json({ success: false, message: "Código no encontrado" });
        }

        // Compara el código ingresado con el almacenado
        const isCodeValid = await bcrypt.compare(code, hashedCode);

        if (!isCodeValid) {
            return res.status(500).json({ success: false, message: "Código inválido, intente nuevamente" });
        }

        // Hashea la nueva contraseña
        const hashedPwd = bcrypt.hashSync(pwd, 10);

        // Recupera el RUT del usuario desde las cookies
        const rutCompleto = req.cookies["username"];
        const [RutFuncionario, DvFuncionario] = rutCompleto.split('-');

        // Actualiza la contraseña en la base de datos
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
        });

        res.clearCookie("pwdcode", {path: "/food-manager"})
        res.clearCookie("username", {path: "/food-manager"})

        return res.status(200).json({ success: true, message: "Contraseña actualizada" });
    } catch (error) {
        const error_log = await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error al cambiar la contraseña",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/auth/login",
                codigo_http: 500
            }
        });
        return res.status(500).json({ success: false, message: "Internal server error " + error, error: error.message });
    }
}

// Cierra la sesión del usuario
async function logout(req, res) {
    try {
        // Limpia las cookies de autenticación
        res.clearCookie("token", { path: '/food-manager' });
        return res.status(200).json({ message: "Has cerrado sesión", success: true });
    } catch (error) {
        const error_log = await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error al cerrar sesión",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/auth/login",
                codigo_http: 500
            }
        });
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
};
