async function renderHome(req, res) {
    res.render('help/home', { tipoUsuario: 1 });
}
module.exports = {
    renderHome
}