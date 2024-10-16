const prisma = require('../server/prisma');

async function renderHome(req, res) {
    try {
        res.render('employee/home', { tipoUsuario: 1 }); 
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
    
}

async function getFuncionarios(req, res) {
    try {
        // Obtener todos los funcionarios desde Prisma
        const funcionarios = await prisma.funcionario.findMany({
            include: {
                TipoContrato: true,
                TipoEstamento: true,
                TipoServicio: true,
                TipoUnidad: true
            }
        });

        // Modificar los datos antes de enviarlos
        const funcionariosTransformados = funcionarios.map(funcionario => {
            return {
                ...funcionario,
                rut: `${funcionario.RutFuncionario}-${funcionario.DvFuncionario}`,  // Concatenar RUT con DV
                NombreFuncionario: capitalizeWords(funcionario.NombreFuncionario),  // Formatear con Initcap
                correo: funcionario.correo ? funcionario.correo.toLowerCase() : null,  // Correo en minúsculas
                // Puedes agregar más campos que necesites formatear aquí...
            };
        });

        res.status(200).json(funcionariosTransformados);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
}
function capitalizeWords(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


module.exports = {
    renderHome,
    getFuncionarios
}