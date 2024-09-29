async function renderHome(req, res) {
    res.render('patient/home', { tipoUsuario: 1 });
}
module.exports = {
    renderHome
}