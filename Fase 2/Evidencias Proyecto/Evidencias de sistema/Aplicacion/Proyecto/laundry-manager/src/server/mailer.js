const nodemailer = require("nodemailer") // package nodemailer

// función de envío de correo
const enviarCorreo = async (email, code) => {
    // configuración del servicio de correo electrónico, cambiar por el que corresponda formalmente
    const config = {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "lav.test2023@gmail.com",
            pass: process.env.EMAIL_PWD
        }
    }
    // configuración del mensaje
    const mensaje = {
        from: "lav.test2023@gmail.com",
        to: email,
        subject: "Cambio de contraseña",
        // cambiar ruta del html por la que corresponda
        html: `
            <h1>Solicitud de cambio de contraseña</h1>
            <br>
            <h2>Su codigo para cambio de contraseña es ${code}, utilicelo bien y no lo comparta.</h2>
        ` // mensaje
    }

    // envío del correo
    const transport = nodemailer.createTransport(config)
    await transport.sendMail(mensaje)
}

// exportación de la función para ser usada en src/routes/funciones.js
module.exports = {
    enviarCorreo
}