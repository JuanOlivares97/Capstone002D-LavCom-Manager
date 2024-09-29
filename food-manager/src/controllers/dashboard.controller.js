async function renderHome(req, res) {
    res.render('dashboard/home', { tipoUsuario: 1 });
}
module.exports = {
    renderHome
}