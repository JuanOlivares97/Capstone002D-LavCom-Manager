const prisma = require("../server/prisma");
const bcrypt = require("bcrypt");
const {
    getContrato,
    getServicio,
    getUnidad,
    getEstamento,
    getTipoFuncionario,
} = require("./maintainer.controller");

// Renderiza la página principal de empleados
async function renderHome(req, res) {
    try {
        // Obtiene los datos necesarios para renderizar la vista desde funciones externas
        const contrato = await getContrato();
        const servicios = await getServicio();
        const unidades = await getUnidad();
        const estamentos = await getEstamento();
        const tipoFuncionario = await getTipoFuncionario();
        const tipoUsuario = req.cookies["tipo_usuario"]; // Obtiene el tipo de usuario desde las cookies

        // Renderiza la vista 'employee/home' con los datos necesarios
        res.render("employee/home", {
            tipoUsuario: parseInt(tipoUsuario), // Convierte tipoUsuario a número
            contrato,
            servicios,
            unidades,
            estamentos,
            tipoFuncionario,
        });
    } catch (error) {
        // Maneja errores devolviendo un estado 500 y un mensaje de error
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Obtiene la lista de todos los funcionarios habilitados
async function getFuncionarios(req, res) {
    try {
        const funcionarios = await prisma.Funcionario.findMany({
            include: {
                TipoContrato: true,
                TipoEstamento: true,
                TipoServicio: true,
                TipoUnidad: true,
            },
            where: {
                Habilitado: "S", // Solo funcionarios habilitados
            },
        });

        // Transforma los datos para formatear nombres y concatenar RUT con DV
        const funcionariosTransformados = funcionarios.map((funcionario) => {
            return {
                ...funcionario,
                rut: `${funcionario.RutFuncionario}-${funcionario.DvFuncionario}`, // Formato de RUT completo
                NombreFuncionario: capitalizeWords(funcionario.NombreFuncionario), // Capitaliza el nombre
                Apellidos: capitalizeWords(
                    `${funcionario.apellido_paterno} ${funcionario.apellido_materno}`
                ),
                correo: funcionario.correo ? funcionario.correo.toLowerCase() : null, // Correo en minúsculas
                TipoContrato: funcionario.TipoContrato
                    ? {
                        IdTipoContrato: funcionario.TipoContrato.IdTipoContrato,
                        TipoContrato: funcionario.TipoContrato.TipoContrato,
                    }
                    : null,
                TipoEstamento: funcionario.TipoEstamento
                    ? {
                        IdTipoEstamento: funcionario.TipoEstamento.IdTipoEstamento,
                        DescTipoEstamento: funcionario.TipoEstamento.DescTipoEstamento,
                    }
                    : null,
                TipoServicio: funcionario.TipoServicio
                    ? {
                        IdTipoServicio: funcionario.TipoServicio.IdTipoServicio,
                        DescTipoServicio: funcionario.TipoServicio.DescTipoServicio,
                    }
                    : null,
                TipoUnidad: funcionario.TipoUnidad
                    ? {
                        IdTipoUnidad: funcionario.TipoUnidad.IdTipoUnidad,
                        DescTipoUnidad: funcionario.TipoUnidad.DescTipoUnidad,
                    }
                    : null,
            };
        });

        // Devuelve la lista de funcionarios transformada
        res.status(200).json(funcionariosTransformados);
    } catch (error) {
        // Maneja errores devolviendo un estado 500 y un mensaje de error
        res
            .status(500)
            .json({ message: "Internal server error: " + error.message });
    }
}

// Crea un nuevo empleado
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

        // Validar campos obligatorios
        if (!nombre_usuario || !apellido_paterno || !RutCompleto || !tipoEstamento || !tipoServicio || !tipoUnidad || !tipoContrato || !tipoFuncionario) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        // Validar formato del RUT
        if (!RutCompleto.includes("-")) {
            return res.status(400).json({
                message: "El RUT debe estar en el formato correcto (12345678-9).",
            });
        }

        const [rut_usuario, dv_usuario] = RutCompleto.split("-"); // Separa el RUT del DV

        // Busca si el empleado ya existe
        const existingEmployee = await prisma.Funcionario.findUnique({
            where: {
                RutFuncionario_DvFuncionario: {
                    RutFuncionario: rut_usuario,
                    DvFuncionario: dv_usuario,
                },
            },
        });

        if (existingEmployee) {
            // Si el empleado ya existe, lo habilita nuevamente
            const updatedEmployee = await prisma.Funcionario.update({
                where: {
                    IdFuncionario: existingEmployee.IdFuncionario,
                },
                data: {
                    Habilitado: "S",
                },
            });

            return res.status(201).json({
                message: "El empleado ya existía y se actualizó su estado a 'Habilitado'",
                empleado: updatedEmployee,
            });
        }

        // Genera una contraseña para el nuevo empleado
        const password = await bcrypt.hash(rut_usuario + dv_usuario, 10);

        // Crea un nuevo registro de empleado
        const funcionario = await prisma.Funcionario.create({
            data: {
                NombreFuncionario: nombre_usuario.toUpperCase(),
                apellido_paterno: apellido_paterno.toUpperCase(),
                apellido_materno: apellido_materno.toUpperCase(),
                RutFuncionario: rut_usuario,
                DvFuncionario: dv_usuario,
                username: nombre_usuario.charAt(0).toLowerCase() + apellido_paterno.toLowerCase(),
                contrasena: password,
                Habilitado: "S",
                TipoEstamento: { connect: { IdTipoEstamento: parseInt(tipoEstamento) } },
                TipoServicio: { connect: { IdTipoServicio: parseInt(tipoServicio) } },
                TipoUnidad: { connect: { IdTipoUnidad: parseInt(tipoUnidad) } },
                TipoContrato: { connect: { IdTipoContrato: parseInt(tipoContrato) } },
                TipoFuncionario: { connect: { IdTipoFuncionario: parseInt(tipoFuncionario) } },
            },
        });

        return res.status(201).json(funcionario);
    } catch (error) {
        console.error("Error en createEmployee:", error);
        return res
            .status(500)
            .json({ message: "Internal server error: " + error.message });
    }
}

// Actualiza los datos de un empleado existente
async function updateEmployee(req, res) {
    try {
        const id = parseInt(req.params.id);
        const {
            nombre_usuario,
            apellido_paterno,
            apellido_materno,
            tipoEstamento,
            tipoServicio,
            tipoUnidad,
            tipoContrato,
            tipoFuncionario,
        } = req.body;

        // Validar campos obligatorios
        if (!nombre_usuario || !tipoFuncionario || !tipoEstamento || !tipoServicio || !tipoUnidad || !tipoContrato) {
            return res.status(400).json({ message: "Todos los campos son requeridos." });
        }

        // Actualiza los datos del empleado
        const funcionario = await prisma.Funcionario.update({
            where: { IdFuncionario: id },
            data: {
                NombreFuncionario: nombre_usuario,
                apellido_paterno,
                apellido_materno,
                TipoEstamento: { connect: { IdTipoEstamento: parseInt(tipoEstamento) } },
                TipoServicio: { connect: { IdTipoServicio: parseInt(tipoServicio) } },
                TipoUnidad: { connect: { IdTipoUnidad: parseInt(tipoUnidad) } },
                TipoContrato: { connect: { IdTipoContrato: parseInt(tipoContrato) } },
                TipoFuncionario: { connect: { IdTipoFuncionario: parseInt(tipoFuncionario) } },
            },
        });

        return res.status(200).json(funcionario);
    } catch (error) {
        console.error("Error en updateEmployee:", error);
        return res.status(500).json({ message: "Internal server error: " + error.message });
    }
}

// Deshabilita un empleado (soft delete)
async function deleteEmployee(req, res) {
    try {
        const id = parseInt(req.params.id);

        // Actualiza el estado de habilitado a 'N'
        const funcionario = await prisma.Funcionario.update({
            where: {
                IdFuncionario: id,
            },
            data: {
                Habilitado: "N",
            },
        });

        res.status(201).json(funcionario);
    } catch (error) {
        res
            .status(500)
            .json({ message: "Internal server error: " + error.message });
    }
}

// Capitaliza las palabras (inicial mayúscula)
function capitalizeWords(str) {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Formatea fechas para la base de datos
const formatDateForDB = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error("Fecha no válida.");
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

module.exports = {
    renderHome,
    getFuncionarios,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};
