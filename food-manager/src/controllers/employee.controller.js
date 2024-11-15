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
        const tipoUsuario = req.cookies['tipo_usuario']
        res.render('employee/home', { tipoUsuario: parseInt(tipoUsuario), contrato, servicios, unidades, estamentos, tipoFuncionario });

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
                Apellidos: capitalizeWords(`${funcionario.apellido_paterno} ${funcionario.apellido_materno}`),
                correo: funcionario.correo ? funcionario.correo.toLowerCase() : null,  // Correo en minúsculas
                TipoContrato: funcionario.TipoContrato
                    ? { IdTipoContrato: funcionario.TipoContrato.IdTipoContrato, TipoContrato: funcionario.TipoContrato.TipoContrato }
                    : null,
                TipoEstamento: funcionario.TipoEstamento
                    ? { IdTipoEstamento: funcionario.TipoEstamento.IdTipoEstamento, DescTipoEstamento: funcionario.TipoEstamento.DescTipoEstamento }
                    : null,
                TipoServicio: funcionario.TipoServicio
                    ? { IdTipoServicio: funcionario.TipoServicio.IdTipoServicio, DescTipoServicio: funcionario.TipoServicio.DescTipoServicio }
                    : null,
                TipoUnidad: funcionario.TipoUnidad
                    ? { IdTipoUnidad: funcionario.TipoUnidad.IdTipoUnidad, DescTipoUnidad: funcionario.TipoUnidad.DescTipoUnidad }
                    : null,
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
            apellido_paterno,
            apellido_materno,
            RutCompleto,
            tipoEstamento,
            tipoServicio,
            tipoUnidad,
            tipoContrato,
            tipoFuncionario,
        } = req.body;

        const username = `${nombre_usuario.charAt(0).toLowerCase()}${apellido_paterno.toLowerCase()}`;
        const fechaInicioContrato = req.body.FechaInicioContrato ? new Date(req.body.FechaInicioContrato) : null;
        const fechaTerminoContrato = req.body.FechaTerminoContrato ? new Date(req.body.FechaTerminoContrato) : null;

        if (!RutCompleto || !RutCompleto.includes('-')) {
            return res.status(400).json({ message: "El RUT debe estar en el formato correcto (12345678-9)." });
        }

        const [rut_usuario, dv_usuario] = RutCompleto.split('-');

        const existingEmployee = await prisma.Funcionario.findUnique({
            where: {
                RutFuncionario_DvFuncionario: {
                    RutFuncionario: rut_usuario,
                    DvFuncionario: dv_usuario
                }
            }
        });

        if (existingEmployee) {
            const updatedEmployee = await prisma.Funcionario.update({
                where: {
                    IdFuncionario: existingEmployee.IdFuncionario
                },
                data: {
                    Habilitado: 'S'
                }
            });

            return res.status(200).json({
                message: "El empleado ya existía y se actualizó su estado a 'Habilitado'.",
                empleado: updatedEmployee
            });
        }

        const password = await bcrypt.hash(rut_usuario + dv_usuario, 10);

        const funcionario = await prisma.Funcionario.create({
            data: {
                NombreFuncionario: nombre_usuario.toUpperCase(),
                apellido_paterno: apellido_paterno.toUpperCase(),
                apellido_materno: apellido_materno.toUpperCase(),
                RutFuncionario: rut_usuario,
                DvFuncionario: dv_usuario,
                username: username,
                contrasena: password,
                Habilitado: 'S',
                FechaInicioContrato: fechaInicioContrato,
                FechaTerminoContrato: fechaTerminoContrato,
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
        console.error(error);
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
}

// Valida si un campo está presente en req.body
function validatePresence(field, fieldName, res) {
    if (!field) {
        res.status(400).json({ message: `El campo '${fieldName}' es requerido.` });
        return false;
    }
    return true;
}

// Valida si un campo es un número
function validateInteger(field, fieldName, res) {
    const intValue = parseInt(field);
    if (isNaN(intValue)) {
        res.status(400).json({ message: `El campo '${fieldName}' debe ser un número válido.` });
        return false;
    }
    return intValue;
}

// Verifica si el ID existe en una tabla específica usando Prisma
async function validateExistence(fieldValue, model, fieldName, res) {
    const recordExists = await prisma[model].findUnique({
        where: { [fieldName]: fieldValue }
    });

    if (!recordExists) {
        res.status(404).json({ message: `El ${fieldName} especificado no existe.` });
        return false;
    }
    return true;
}

// Función para actualizar el empleado
async function updateEmployee(req, res) {
    try {
        const id = parseInt(req.params.id);
        const {
            nombre_usuario,
            apellido_paterno,
            apellido_materno,
            rut_usuario,
            dv_usuario,
            tipoEstamento,
            tipoServicio,
            tipoUnidad,
            tipoContrato,
            tipoFuncionario
        } = req.body;

        console.log(nombre_usuario,
            apellido_paterno,
            apellido_materno,
            rut_usuario,
            dv_usuario,
            tipoEstamento,
            tipoServicio,
            tipoUnidad,
            tipoContrato,
            tipoFuncionario
        );  
        // Validaciones para cada campo
        if (!validatePresence(tipoFuncionario, 'tipoFuncionario', res)) return;
        const tipoFuncionarioId = validateInteger(tipoFuncionario, 'tipoFuncionario', res);
        if (!tipoFuncionarioId) return;
        if (!(await validateExistence(tipoFuncionarioId, 'TipoFuncionario', 'IdTipoFuncionario', res))) return;

        if (!validatePresence(tipoEstamento, 'tipoEstamento', res)) return;
        const tipoEstamentoId = validateInteger(tipoEstamento, 'tipoEstamento', res);
        if (!tipoEstamentoId) return;
        if (!(await validateExistence(tipoEstamentoId, 'TipoEstamento', 'IdTipoEstamento', res))) return;

        if (!validatePresence(tipoServicio, 'tipoServicio', res)) return;
        const tipoServicioId = validateInteger(tipoServicio, 'tipoServicio', res);
        if (!tipoServicioId) return;
        if (!(await validateExistence(tipoServicioId, 'TipoServicio', 'IdTipoServicio', res))) return;

        if (!validatePresence(tipoUnidad, 'tipoUnidad', res)) return;
        const tipoUnidadId = validateInteger(tipoUnidad, 'tipoUnidad', res);
        if (!tipoUnidadId) return;
        if (!(await validateExistence(tipoUnidadId, 'TipoUnidad', 'IdTipoUnidad', res))) return;

        if (!validatePresence(tipoContrato, 'tipoContrato', res)) return;
        const tipoContratoId = validateInteger(tipoContrato, 'tipoContrato', res);
        if (!tipoContratoId) return;
        if (!(await validateExistence(tipoContratoId, 'TipoContrato', 'IdTipoContrato', res))) return;

        // Actualizar el funcionario
        const funcionario = await prisma.Funcionario.update({
            where: {
                IdFuncionario: id
            },
            data: {
                NombreFuncionario: nombre_usuario,
                apellido_paterno: apellido_paterno,
                apellido_materno: apellido_materno,
                RutFuncionario: rut_usuario,
                DvFuncionario: dv_usuario,
                TipoEstamento: {
                    connect: {
                        IdTipoEstamento: tipoEstamentoId
                    }
                },
                TipoServicio: {
                    connect: {
                        IdTipoServicio: tipoServicioId
                    }
                },
                TipoUnidad: {
                    connect: {
                        IdTipoUnidad: tipoUnidadId
                    }
                },
                TipoContrato: {
                    connect: {
                        IdTipoContrato: tipoContratoId
                    }
                },
                TipoFuncionario: {
                    connect: {
                        IdTipoFuncionario: tipoFuncionarioId
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