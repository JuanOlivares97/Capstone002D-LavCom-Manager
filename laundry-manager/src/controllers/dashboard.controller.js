function renderHome(req, res) {
    try {
        return res.render("dashboard/home", {tipo_usuario: req.user.tipo_usuario});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

 module.exports = {
    renderHome
}