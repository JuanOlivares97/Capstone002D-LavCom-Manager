function renderHome(req, res) {
    try {
        const tipo_user = req.user["tipo_usuario"];
        return res.render("dashboard/home", { tipo_usuario: tipo_user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

 module.exports = {
    renderHome
}