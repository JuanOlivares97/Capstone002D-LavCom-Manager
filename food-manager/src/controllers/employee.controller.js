const prisma = require('../server/prisma');
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

async function createEmployee(req, res){
    try {
        const { nombre_usuario, rut_usuario, dv_usuario, correo, telefono, direccion, tipoEstamento, tipoServicio, tipoUnidad, tipoContrato } = req.body;
        const funcionario = await prisma.funcionario.create({
            data: {
                NombreFuncionario: nombre_usuario,
                RutFuncionario: rut_usuario,
                DvFuncionario: dv_usuario,
                CorreoFuncionario: correo,
                TelefonoFuncionario: telefono,
                DireccionFuncionario: direccion,
                TipoEstamento: {
                    connect: {
                        id: tipoEstamento
                    }
                },
                TipoServicio: {
                    connect: {
                        id: tipoServicio
                    }
                },
                TipoUnidad: {
                    connect: {
                        id: tipoUnidad
                    }
                },
                TipoContrato: {
                    connect: {
                        id: tipoContrato
                    }
                }
            },
        });
        res.status(201).json(funcionario);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
}

async function updateEmployee(req, res){
    try {
        const { id, nombre_usuario, rut_usuario, dv_usuario, correo, telefono, direccion, tipoEstamento, tipoServicio, tipoUnidad, tipoContrato } = req.body;
        const funcionario = await prisma.funcionario.update({
            where: {
                IdFuncionario: id
            },
            data: {
                NombreFuncionario: nombre_usuario,
                RutFuncionario: rut_usuario,
                DvFuncionario: dv_usuario,
                CorreoFuncionario: correo,
                TelefonoFuncionario: telefono,
                DireccionFuncionario: direccion,
                TipoEstamento: {
                    connect: {
                        id: tipoEstamento
                    }
                },
                TipoServicio: {
                    connect: {
                        id: tipoServicio
                    }
                },
                TipoUnidad: {
                    connect: {
                        id: tipoUnidad
                    }
                },
                TipoContrato: {
                    connect: {
                        id: tipoContrato
                    }
                }
            },
        });
        res.status(200).json(funcionario);
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
    getFuncionarios,
    createEmployee,
    updateEmployee
}