async function renderHome(req, res) {
    try {
        const tipo_user = req.user["tipo_usuario"];
        return res.status(200).render("help/home", {tipo_usuario: tipo_user});
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/help/home",
                codigo_http: 500,
            }
        })
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    renderHome
}