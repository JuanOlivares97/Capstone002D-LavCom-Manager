
async function renderHome(req, res) {
    res.render('employee/home', { tipoUsuario: 1 });
}

module.exports = {
    renderHome
}