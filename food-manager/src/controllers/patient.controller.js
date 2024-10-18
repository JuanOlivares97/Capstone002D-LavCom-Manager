const prisma = require('../server/prisma');
const {
    getServicio,
    getUnidad,
    getVia,
    getRegimen } = require('./maintainer.controller');

async function renderHome(req, res) {
    try {
        // Obtener los servicios
        const servicios = await getServicio();
        const unidades = await getUnidad();
        const vias = await getVia();
        const regimen = await getRegimen();
        // Obtener los pacientes
        const pacientes = await prisma.Hospitalizado.findMany({
            where: {
                OR: [
                    { FechaAlta: null },
                    { FechaAlta: { gt: new Date() } }
                ]
            },
            include: {
                TipoRegimen: true,
                TipoUnidad: true,
                TipoVia: true,
                logMovimientosPaciente: true
            }
        });

        // Añadir la edad a cada paciente
        const pacientesConEdad = pacientes.map(paciente => {
            return {
                ...paciente,
                edad: calcularEdad(paciente.FechaNacimiento)
            };
        });

        // Renderizar la vista y pasar los servicios y pacientes
        res.render('patient/home', { tipoUsuario: 1, pacientes: pacientesConEdad, servicios, unidades,vias,regimen });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " + error });
    }
}

async function getPacientes(req, res) {
    try {
        const pacientes = await prisma.hospitalizado.findMany({
            where: {
                OR: [
                    { FechaAlta: null },
                    { FechaAlta: { gt: new Date() } }
                ]
            },
            include: {
                TipoRegimen: true,  // Incluir la relación con TipoRegimen
                TipoServicio_Hospitalizado_IdTipoServicioToTipoServicio: true,  // Incluir TipoServicio
                TipoUnidad: true,  // Incluir TipoUnidad
                TipoVia: true,  // Incluir TipoVia
                logMovimientosPaciente: true  // Incluir los logs de movimientos del paciente
            }
        });

        return res.status(200).json(pacientes);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " + error });
    }
}

async function createPaciente(req, res) {
    try {
        // Verificar si el paciente ya existe en la base de datos
        const pacienteExistente = await prisma.Hospitalizado.findFirst({
            where: {
                RutHospitalizado: parseInt(req.body.RutHospitalizado)  // Buscar por el Rut
            }
        });

        if (pacienteExistente) {
            // Si el paciente ya existe, actualizamos la fecha de ingreso y creamos un log de reingreso
            const pacienteActualizado = await prisma.Hospitalizado.update({
                where: {
                    IdHospitalizado: pacienteExistente.IdHospitalizado
                },
                data: {
                    FechaIngreso: new Date(req.body.FechaIngreso)  // Actualizar la fecha de ingreso
                }
            });

            // Crear un log de reingreso
            await prisma.logMovimientosPaciente.create({
                data: {
                    descripcionLog: 'Paciente Reingresa al Hospital',
                    idPaciente: pacienteActualizado.IdHospitalizado,
                    fechaLog: new Date()  // Fecha actual
                }
            });

            return res.status(200).json({ message: 'Paciente reingresado exitosamente', paciente: pacienteActualizado });
        } else {
            // Si el paciente no existe, creamos uno nuevo
            const nuevoPaciente = await prisma.Hospitalizado.create({
                data: {
                    CodigoCama: parseInt(req.body.CodigoCama),
                    RutHospitalizado: parseInt(req.body.RutHospitalizado),
                    DvHospitalizado: req.body.DvHospitalizado,
                    NombreHospitalizado: req.body.NombreHospitalizado,
                    ApellidoP: req.body.ApellidoP,
                    ApellidoM: req.body.ApellidoM,
                    FechaNacimiento: new Date(req.body.FechaNacimiento),
                    FechaIngreso: new Date(req.body.FechaIngreso),
                    Telefono: parseInt(req.body.Telefono),
                    Direccion: req.body.Direccion,
                    Correo: req.body.Correo,
                    ObservacionesNutricionista: req.body.ObservacionesNutricionista,
                    IdTipoServicio: parseInt(req.body.IdTipoServicio),
                    IdTipoUnidad: parseInt(req.body.IdTipoUnidad),
                    IdTipoVia: parseInt(req.body.IdTipoVia),
                    IdTipoRegimen: parseInt(req.body.IdTipoRegimen)
                }
            });

            // Crear un log de ingreso
            await prisma.logMovimientosPaciente.create({
                data: {
                    descripcionLog: 'Paciente Hace Ingreso al Hospital',
                    idPaciente: nuevoPaciente.IdHospitalizado,
                    fechaLog: new Date()  // Fecha actual
                }
            });

            return res.status(200).json({ message: 'Paciente ingresado exitosamente', paciente: nuevoPaciente });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear o reingresar el paciente' });
    }
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad;
}

async function getMovimientosPaciente(req, res) {
    const idPaciente = parseInt(req.params.id);
    try {
        const movimientos = await prisma.logMovimientosPaciente.findMany({
            where: {
                idPaciente: idPaciente
            }
        });
        return res.status(200).json(movimientos);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " + error });
    }
}



module.exports = {
    renderHome,
    getPacientes,
    createPaciente,
    getMovimientosPaciente
}