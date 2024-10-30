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

        const today = new Date();
      const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
  
      // Promesas para KPIs diarios y datos históricos
      const [
        pacientesHospitalizados,
        pacientesEnAyuno,
        ingresosHoy,
        altasHoy,
      ] = await Promise.all([
        prisma.Hospitalizado.count(),
        prisma.Hospitalizado.count({ where: { FechaFinAyuno: { lt: today } } }),
        prisma.Hospitalizado.count({ where: { FechaIngreso: today } }),
        prisma.Hospitalizado.count({ where: { FechaAlta: today } }),
      ]);

        // Añadir la edad a cada paciente
        const pacientesConEdad = pacientes.map(paciente => {
            return {
                ...paciente,
                edad: calcularEdad(paciente.FechaNacimiento)
            };
        });

        // Renderizar la vista y pasar los servicios y pacientes
        res.render('patient/home', { tipoUsuario: 1, pacientes: pacientesConEdad, servicios, unidades, vias, regimen, pacientesHospitalizados,
            pacientesEnAyuno,
            ingresosHoy,
            altasHoy, });
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

async function movePatientService(req, res) {
    // Verificar si el paciente existe en la base de datos
    try {
        const paciente = await prisma.Hospitalizado.findFirst({
            where: {
                IdHospitalizado: parseInt(req.params.id)
            },
            include: {
                TipoServicio_Hospitalizado_IdTipoServicioToTipoServicio: true
            }
        });
        const oldService = paciente.TipoServicio_Hospitalizado_IdTipoServicioToTipoServicio.IdTipoServicio;
        const newService = parseInt(req.body.newService);

        const servicios = await getServicio();
        const newServiceIndex = servicios.findIndex(servicio => servicio.IdTipoServicio === newService);

        if (newServiceIndex === -1) {
            return res.status(400).json({ message: 'Servicio no válido' });
        }
        if (newService === oldService) {
            return res.status(400).json({ message: 'Servicio no cambiado' });
        }
        const strServicio = servicios[newServiceIndex].DescTipoServicio;
        // Actualizar el servicio del paciente
        await prisma.Hospitalizado.update({
            where: {
                IdHospitalizado: paciente.IdHospitalizado
            },
            data: {
                IdTipoServicio: newService
            }
        });
        const movimiento = await prisma.logMovimientosPaciente.create({
            data: {
                idPaciente: paciente.IdHospitalizado,
                fechaLog: new Date(),
                descripcionLog: `Movimiento del Servicio ${oldService} al ${strServicio}`
            }
        });
        return res.status(200).json({ message: 'Movimiento al Servicio', movimiento });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " + error });
    }
}

async function changeRegimen(req, res) {
    // Verificar si el paciente existe en la base de datos
    try {
        const paciente = await prisma.Hospitalizado.findFirst({
            where: {
                IdHospitalizado: parseInt(req.params.id)
            },
            include: {
                TipoRegimen: true
            }
        });
        const oldRegimen = paciente.TipoRegimen.DescTipoRegimen;
        const newRegimen = parseInt(req.body.newRegimen);

        const regimens = await getRegimen();
        const newRegimenIndex = regimens.findIndex(regimen => regimen.IdTipoRegimen === newRegimen);

        if (newRegimenIndex === -1) {
            return res.status(400).json({ message: 'Regimen no válido' });
        }
        if (newRegimen === oldRegimen) {
            return res.status(400).json({ message: 'Regimen no cambiado' });
        }
        const strRegimen = regimens[newRegimenIndex].DescTipoRegimen;
        // Actualizar el servicio del paciente
        await prisma.Hospitalizado.update({
            where: {
                IdHospitalizado: paciente.IdHospitalizado
            },
            data: {
                IdTipoRegimen: newRegimen
            }
        });
        const movimiento = await prisma.logMovimientosPaciente.create({
            data: {
                idPaciente: paciente.IdHospitalizado,
                fechaLog: new Date(),
                descripcionLog: `Movimiento del Regimen ${oldRegimen} al ${strRegimen}`
            }
        });
        return res.status(200).json({ message: 'Movimiento al Regimen', movimiento });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " + error });
    }
}

async function changeObservacionesAlta(req, res) {
    // Verificar si el paciente existe en la base de datos
    try {
        const paciente = await prisma.Hospitalizado.findFirst({
            where: {
                IdHospitalizado: parseInt(req.params.id)
            }
        });
        const oldObservacionesAlta = paciente.ObservacionesAlta || 'Sin Observacion';
        const newObservacionesAlta = req.body.newObservacionesAlta;

        // Actualizar el servicio del paciente
        await prisma.Hospitalizado.update({
            where: {
                IdHospitalizado: paciente.IdHospitalizado
            },
            data: {
                ObservacionesAlta: newObservacionesAlta
            }
        });
        const movimiento = await prisma.logMovimientosPaciente.create({
            data: {
                idPaciente: paciente.IdHospitalizado,
                fechaLog: new Date(),
                descripcionLog: `Cambio de Observaciones de Alta: ${oldObservacionesAlta} a ${newObservacionesAlta}`
            }
        });
        return res.status(200).json({ message: 'Movimiento al Observaciones de Alta', movimiento });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " + error });
    }
}

async function changeObservacionesNutricionista(req, res) {
    // Verificar si el paciente existe en la base de datos
    try {
        const paciente = await prisma.Hospitalizado.findFirst({
            where: {
                IdHospitalizado: parseInt(req.params.id)
            }
        });
        const oldObservacionesNutricionista = paciente.ObservacionesNutricionista || 'Sin Observacion';
        const newObservacionesNutricionista = req.body.newObservacionesNutricionista;
        // Actualizar el servicio del paciente
        await prisma.Hospitalizado.update({
            where: {
                IdHospitalizado: paciente.IdHospitalizado
            },
            data: {
                ObservacionesNutricionista: newObservacionesNutricionista
            }
        });
        const movimiento = await prisma.logMovimientosPaciente.create({
            data: {
                idPaciente: paciente.IdHospitalizado,
                fechaLog: new Date(),
                descripcionLog: `Cambio de Observaciones Nutricionista: ${oldObservacionesNutricionista} a ${newObservacionesNutricionista}`
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " + error });
    }
}

async function changeObservacionesGenerales(req, res) {
    // Verificar si el paciente existe en la base de datos
    try {
        const paciente = await prisma.Hospitalizado.findFirst({
            where: {
                IdHospitalizado: parseInt(req.params.id)
            }
        });
        const oldObservacionesGenerales = paciente.ObservacionesGenerales || 'Sin Observacion';
        const newObservacionesGenerales = req.body.newObservacionesGenerales;
        // Actualizar el servicio del paciente
        await prisma.Hospitalizado.update({
            where: {
                IdHospitalizado: paciente.IdHospitalizado
            },
            data: {
                ObservacionesSala: newObservacionesGenerales
            }
        });
        const movimiento = await prisma.logMovimientosPaciente.create({
            data: {
                idPaciente: paciente.IdHospitalizado,
                fechaLog: new Date(),
                descripcionLog: `Cambio de Observaciones Generales: ${oldObservacionesGenerales} a ${newObservacionesGenerales}`
            }
        });
        return res.status(200).json({ message: 'Movimiento al Observaciones Generales', movimiento });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " + error });
    }
}   




module.exports = {
    renderHome,
    getPacientes,
    createPaciente,
    getMovimientosPaciente,
    movePatientService,
    changeRegimen,
    changeObservacionesAlta,
    changeObservacionesNutricionista,
    changeObservacionesGenerales
}