function renderLogin(req, res) {
    try {
        return res.render("auth/login");
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

function renderRecuperarContrasenaForm(req, res) {
    try {
        return res.render("auth/recuperar_pwd_form");
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

function renderRecuperarContrasenaInfo(req, res) {
    try {
        return res.render("auth/recuperar_pwd_info");
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    renderLogin,
    renderRecuperarContrasenaForm,
    renderRecuperarContrasenaInfo
}