async function renderHome(req, res) {
    const tipoUsuario = req.user.tipo_usuario;
    res.render('help/home', { tipoUsuario: parseInt(tipoUsuario) });
}
module.exports = {
    renderHome
}