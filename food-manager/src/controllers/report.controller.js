async function renderHome(req, res) {
    res.render('report/home', { tipoUsuario: 1 });
}
module.exports = {
    renderHome
}