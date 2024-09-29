async function renderHome(req, res) {
    res.render('maintainer/home', { tipoUsuario: 1 });
}
module.exports = {
    renderHome
}