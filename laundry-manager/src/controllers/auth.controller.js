const prisma = require("../server/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../server/mailer")

// FUNCIÓN PARA RENDERIZAR PÁGINA DE LOGIN
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

// FUNCION PARA RENDERIZAR PÁGINA DE RECUPERAR CONTRASEÑA (FORMULARIO)
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

// FUNCION PARA RENDERIZAR PÁGINA DE RECUPERAR CONTRASEÑA (INFO)
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

// FUNCION PARA INICIO DE SESIÓN
async function login(req, res) {
    try {
        // Desestructuración de los datos enviados en la solicitud
        const { username, pwd } = req.body;

        // Buscar el usuario en la base de datos por su nombre de usuario
        const user = await prisma.usuarios.findUnique({ where: { username } });

        // Si el usuario no se encuentra, se registra un error y se retorna una respuesta 401
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

        // Verificar si la contraseña ingresada es válida comparándola con la almacenada
        const isPasswordValid = await bcrypt.compare(pwd, user.pwd);

        // Si la contraseña no es válida, se registra un error y se retorna una respuesta 401
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

        // Generar un token JWT para el usuario
        const token_data = {
            id_usuario: user.id_usuario,
        }
        const token = jwt.sign(token_data, process.env.JWT_SECRET, { expiresIn: "8h" });

        // Verificar si el usuario tiene un correo electrónico registrado
        let emailValidation = {
            hasEmail: true,
            id_usuario: user.id_usuario
        };
        if(user.email === null) {
            emailValidation.hasEmail = false;
        }

        // Enviar el token en una cookie de sesión y retornar una respuesta exitosa
        res.cookie("token", token, { path: "/laundry-manager", httpOnly: true, sameSite: "Strict" });
        return res.status(200).json({ message: "Has iniciado sesión, bienvenido", success: true, emailValidation });
    } catch (error) {
        // En caso de error, se registra un error en el log y se retorna una respuesta 500
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


// FUNCION PARA ESTABLECER CORREO ELECTRÓNICO
async function setEmail(req, res) {
    try {
        // Obtener el correo electrónico y el ID del usuario desde la solicitud
        const email = req.body.email;
        const user = await prisma.usuarios.findUnique({ where: { id_usuario: req.body.id_usuario } });

        console.log(user);

        // Verificar si el usuario existe, si no se encuentra, registrar el error y devolver respuesta 401
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

        // Actualizar el correo electrónico del usuario
        const updatedUser = await prisma.usuarios.update({
            where: { id_usuario: req.body.id_usuario },
            data: {
                email: email
            }
        });

        // Si no se pudo actualizar el usuario, registrar el error y devolver respuesta 500
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

        // Respuesta exitosa si se actualizó correctamente el correo
        return res.status(200).json({ message: "Correo electrónico establecido", success: true });
    } catch (error) {
        // En caso de error interno, registrar el error y devolver respuesta 500
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

// FUNCION PARA ENVIAR CORREO DE RECUPERACIÓN DE CONTRASEÑA
async function sendPwdEmail(req, res) {
    try {
        // Obtener el correo electrónico y el nombre de usuario desde la solicitud
        const email = req.body.email
        const username = req.body.username

        // Buscar al usuario en la base de datos por correo y nombre de usuario
        const user = await prisma.usuarios.findUnique({
            where: {
                username: username,
                email: email
            }
        })

        // Si no se encuentra el usuario, registrar el error y devolver respuesta 404
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

        // Generar un código de recuperación aleatorio de 4 dígitos
        const code = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        // Crear cookies para almacenar el código y el nombre de usuario
        res.cookie("pwdcode", bcrypt.hashSync(code.toString(), 10), {path: "/laundry-manager", httpOnly: true})
        res.cookie("username", username, {path: "/laundry-manager", httpOnly: true})

        // Enviar el código al correo electrónico del usuario
        await mailer.enviarCorreo(email, code.toString())

        // Redirigir al usuario a la página de recuperación de contraseña
        return res.redirect("/laundry-manager/auth/recuperar-pwd-info")
    } catch (error) {
        // En caso de error interno, registrar el error y devolver respuesta 500
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

// FUNCION PARA CAMBIAR CONTRASEÑA
async function changePwd(req, res) {
    try {
        // Obtener el código y la nueva contraseña desde la solicitud
        const code = req.body.code
        const pwd = req.body.pwd

        // Obtener el código hasheado desde las cookies
        const hashedCode = req.cookies.pwdcode

        // Si no se encuentra el código en las cookies, registrar el error y devolver respuesta 500
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

        // Comparar el código recibido con el código hasheado almacenado en las cookies
        const isCodeValid = await bcrypt.compare(code, hashedCode)

        // Si el código no es válido, registrar el error y devolver respuesta 500
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

        // Hashear la nueva contraseña
        const hashedPwd = bcrypt.hashSync(pwd, 10)

        // Actualizar la contraseña del usuario en la base de datos
        await prisma.usuarios.update({
            where: {
                username: req.cookies.username
            },
            data: {
                pwd: hashedPwd
            }
        })

        // Eliminar las cookies de código y nombre de usuario
        res.clearCookie("pwdcode", {path: "/laundry-manager"})
        res.clearCookie("username", {path: "/laundry-manager"})

        // Devolver respuesta indicando que la contraseña fue actualizada
        return res.status(200).json({success: true, message: "Contraseña actualizada"})
    } catch (error) {
        // En caso de error interno, registrar el error y devolver respuesta 500
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

// FUNCION PARA CERRAR SESIÓN
async function logout(req, res) {
    try {
        // Eliminar la cookie de token para cerrar sesión
        res.clearCookie("token", { path: '/laundry-manager' });
        
        // Devolver respuesta indicando que se ha cerrado sesión correctamente
        return res.status(200).json({ message: "Has cerrado sesión", success: true });
    } catch (error) {
        // En caso de error interno, registrar el error y devolver respuesta 500
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

// EXPORTAR FUNCIONES
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