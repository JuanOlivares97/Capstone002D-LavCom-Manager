// FUNCIÓN PARA RENDERIZAR LA PÁGINA PRINCIPAL (HOME)
async function renderHome(req, res) {
    try {
        // Obtener el tipo de usuario desde la solicitud
        const tipo_user = req.user["tipo_usuario"]; 

        // Renderiza la vista "help/home", pasando el tipo de usuario
        return res.status(200).render("help/home", {tipo_usuario: tipo_user});

    } catch (error) {
        // Si ocurre un error, lo registramos en la base de datos
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si hay un usuario, lo guardamos, sino null
                tipo_error: "Error interno del servidor", // Error genérico
                mensaje_error: JSON.stringify(error), // El error completo para depuración
                ruta_error: "laundry-manager/help/home", // Ruta donde ocurrió el error
                codigo_http: 500, // Código HTTP de error
            }
        })
        
        // Devolver un error 500 al cliente
        return res.status(500).json({ message: "Internal server error" });
    }
}

// EXPORTAR FUNCION
module.exports = {
    renderHome
}