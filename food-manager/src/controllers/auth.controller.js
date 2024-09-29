async function renderLogin(req, res) {
    res.render('auth/login', { tipoUsuario: 1 });
}

module.exports = {
    renderLogin
}