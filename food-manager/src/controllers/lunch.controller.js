async function renderHome(req, res) {
    res.render('lunch/home', { tipoUsuario: 1 });
}
module.exports = {
    renderHome
}