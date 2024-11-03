const prisma = require('../server/prisma');
const bcrypt = require('bcrypt');
const {
    getContrato,
    getServicio,
    getUnidad,
    getEstamento,
    getTipoFuncionario } = require('./maintainer.controller');

async function renderHome(req, res) {
    try {
        const contrato = await getContrato();
        const servicios = await getServicio();
        const unidades = await getUnidad();
        const estamentos = await getEstamento();
        const tipoFuncionario = await getTipoFuncionario();

        res.render('employee/home', { tipoUsuario: 1, contrato, servicios, unidades, estamentos, tipoFuncionario });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

}

async function getFuncionarios(req, res) {
    try {
        // Obtener todos los funcionarios desde Prisma
        const funcionarios = await prisma.Funcionario.findMany({
            include: {
                TipoContrato: true,
                TipoEstamento: true,
                TipoServicio: true,
                TipoUnidad: true
            },
            where: {
                Habilitado: 'S'
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

async function createEmployee(req, res) {

    try {
        const {
            nombre_usuario,
            RutCompleto,
            tipoEstamento,
            tipoServicio,
            tipoUnidad,
            tipoContrato,
            tipoFuncionario,
        } = req.body;

        const fechaInicioContrato = ((req.body.fechaInicioContrato));
        const fechaTerminoContrato = ((req.body.fechaTerminoContrato));

        // Verificación básica del formato de RutCompleto
        if (!RutCompleto || !RutCompleto.includes('-')) {
            return res.status(400).json({ message: "El RUT debe estar en el formato correcto (12345678-9)." });
        }

        const [rut_usuario, dv_usuario] = RutCompleto.split('-');

        const password = await bcrypt.hash(rut_usuario + dv_usuario, 10);

        const funcionario = await prisma.funcionario.create({
            data: {
                NombreFuncionario: nombre_usuario.toUpperCase(),
                RutFuncionario: rut_usuario,
                DvFuncionario: dv_usuario,
                contrasena: password,
                Habilitado: 'S',
                fechaInicioContrato: fechaInicioContrato, // Formato 'YYYY-MM-DD'
                fechaTerminoContrato: fechaTerminoContrato, // Formato 'YYYY-MM-DD'
                TipoEstamento: {
                    connect: {
                        IdTipoEstamento: parseInt(tipoEstamento)
                    }
                },
                TipoServicio: {
                    connect: {
                        IdTipoServicio: parseInt(tipoServicio)
                    }
                },
                TipoUnidad: {
                    connect: {
                        IdTipoUnidad: parseInt(tipoUnidad)
                    }
                },
                TipoContrato: {
                    connect: {
                        IdTipoContrato: parseInt(tipoContrato)
                    }
                },
                TipoFuncionario: {
                    connect: {
                        IdTipoFuncionario: parseInt(tipoFuncionario)
                    }
                },
            },
        });

        res.status(201).json(funcionario);
    } catch (error) {
        console.error(error); // Para ayudar en la depuración
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
}


async function updateEmployee(req, res) {
    try {
        const id = parseInt(req.params.id);
        const {
            nombre_usuario,
            rut_usuario,
            dv_usuario,
            tipoEstamento,
            tipoServicio,
            tipoUnidad,
            tipoContrato,
            tipoFuncionario
        } = req.body;

        // Check if `tipoFuncionario` exists
        const tipoFuncionarioExists = await prisma.TipoFuncionario.findUnique({
            where: { IdTipoFuncionario: parseInt(tipoFuncionario) } // Ensure `id` is an integer
        });

        if (!tipoFuncionarioExists) {
            throw new Error('El tipoFuncionario especificado no existe');
        }

        // Update `funcionario`
        const funcionario = await prisma.Funcionario.update({
            where: {
                IdFuncionario: id
            },
            data: {
                NombreFuncionario: nombre_usuario,
                RutFuncionario: rut_usuario,
                DvFuncionario: dv_usuario,
                TipoEstamento: {
                    connect: {
                        IdTipoEstamento: parseInt(tipoEstamento)
                    }
                },
                TipoServicio: {
                    connect: {
                        IdTipoServicio: parseInt(tipoServicio)
                    }
                },
                TipoUnidad: {
                    connect: {
                        IdTipoUnidad: parseInt(tipoUnidad)
                    }
                },
                TipoContrato: {
                    connect: {
                        IdTipoContrato: parseInt(tipoContrato)
                    }
                },
                TipoFuncionario: {
                    connect: {
                        IdTipoFuncionario: parseInt(tipoFuncionario)
                    }
                },
            },
        });
        res.status(200).json(funcionario);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
}

async function deleteEmployee(req, res) {
    try {
        const id = parseInt(req.params.id);
        const funcionario = await prisma.Funcionario.update({
            where: {
                IdFuncionario: id
            },
            data: {
                Habilitado: 'N'
            }
        });
        res.status(201).json(funcionario);
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

const formatDateForDB = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Fecha no válida.");
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


module.exports = {
    renderHome,
    getFuncionarios,
    createEmployee,
    updateEmployee,
    deleteEmployee
}