async function renderLogin(req, res) {
    res.render("auth/login", { layout: false }); //reemplazar tipo de usuario por layout
}

async function login(req, res) {
    try {
        const { username, pwd } = req.body;

        // Separate the RUT number and check digit
        const [rut, dv] = username.split('-'); // '20880026-4' becomes ['20880026', '4']

        // Convert rut to an integer
        const numericRut = parseInt(rut, 10);

        // Query the database using both the RUT number and the check digit
        const user = await prisma.funcionario.findUnique({
            where: {
                RutFuncionario: numericRut,
                DvFuncionario: dv,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos", success: false });
        }

        const isPasswordValid = await bcrypt.compare(pwd, user.contrasena);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos", success: false });
        }

        const token_data = {
            id_usuario: user.IdFuncionario,
            rut: `${user.RutFuncionario}-${user.DvFuncionario}`,
            nombre: user.NombreFuncionario,
            tipo_usuario: user.IdTipoFuncionario
        }
        const token = jwt.sign(token_data, process.env.JWT_SECRET, { expiresIn: "8h" });

        res.cookie("token", token, { path: "/" });
        res.cookie("logged-in", true, { path: "/" });
        res.cookie("tipo_usuario", user.IdTipoFuncionario, { path: "/" });
        res.cookie("rutLogueado", user.RutFuncionario, { path: "/" });
        res.cookie("dvLogueado", user.DvFuncionario, { path: "/" });

        return res.status(200).json({ message: "Has iniciado sesión, bienvenido", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("token");
        res.clearCookie("logged-in");
        return res.status(200).json({ message: "Has cerrado sesión", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

module.exports = {
    renderLogin,
    login,
    logout
};
