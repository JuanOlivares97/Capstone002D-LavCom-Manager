async function renderLogin(req, res) {
    res.render("auth/login", { layout: false }); //reemplazar tipo de usuario por layout
}

module.exports = {
    renderLogin,
};
