async function renderHome(req, res) {
    const tipoUsuario = req.cookies['tipo_usuario']
    res.render('help/home', { tipoUsuario: parseInt(tipoUsuario) });
}
module.exports = {
    renderHome
}