
async function renderHome(req, res) {
    res.render('employee/home', { tipoUsuario: 1 });
}

async function getFuncionario(req, res) {
    try {
        const users = await prisma.Funcionario.findMany({
            where: {
                Habilitado: 'S'
            }
        });
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    renderHome,
    getFuncionario
}