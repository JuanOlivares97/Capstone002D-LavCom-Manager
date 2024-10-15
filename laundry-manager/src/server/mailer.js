const nodemailer = require("nodemailer") // package nodemailer

// función de envío de correo
const enviarCorreo = async (formulario) => {
    // configuración del servicio de correo electrónico, cambiar por el que corresponda formalmente
    const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "lav.test2023@gmail.com",
            pass: "ihzv ykdz xbgn mwts"
        }
    }
    // configuración del mensaje
    const mensaje = {
        from: "lav.test2023@gmail.com",
        to: formulario.correo,
        subject: "Cambio de contraseña",
        // cambiar ruta del html por la que corresponda
        html: `` // mensaje
    }

    // envío del correo
    const transport = nodemailer.createTransport(config)
    await transport.sendMail(mensaje)
}

// exportación de la función para ser usada en src/routes/funciones.js
module.exports = enviarCorreo