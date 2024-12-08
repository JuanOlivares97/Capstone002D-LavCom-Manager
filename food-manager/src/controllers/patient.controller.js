const prisma = require('../server/prisma');
const {
  getServicio,
  getUnidad,
  getVia,
  getRegimen
} = require('./maintainer.controller');
const moment = require('moment-timezone');

async function renderHome(req, res) {
  try {
    const [servicios, unidades, vias, regimen] = await Promise.all([
      getServicio(),
      getUnidad(),
      getVia(),
      getRegimen()
    ]);

    // Obtener los pacientes con las condiciones especificadas
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

    // Obtener la fecha actual en la zona horaria de Chile y definir el inicio y fin del día
    const startOfTodayChile = moment().tz('America/Santiago').startOf('day');
    const endOfTodayChile = moment().tz('America/Santiago').endOf('day');

    // Convertir el inicio y fin del día a UTC para comparar con fechas en UTC en la base de datos
    const startOfTodayUTC = startOfTodayChile.clone().utc().toDate();
    const endOfTodayUTC = endOfTodayChile.clone().utc().toDate();

    // KPIs diarios y datos históricos comparando solo fechas
    const [
      pacientesHospitalizados,
      pacientesEnAyuno,
      ingresosHoy,
      altasHoy
    ] = await Promise.all([
      prisma.Hospitalizado.count({
        where: {
          OR: [
            { FechaAlta: null },
            { FechaAlta: { gt: new Date() } }
          ]
        }
      }),
      prisma.Hospitalizado.count({
        where: {
          FechaFinAyuno: {
            // Comparamos si la fecha de fin de ayuno es posterior o igual al inicio del día actual en Chile (UTC)
            gte: startOfTodayUTC
          },
          FechaAlta: null
        }
      }),
      prisma.Hospitalizado.count({
        where: {
          FechaIngreso: {
            gte: startOfTodayChile,
            lte: endOfTodayChile
          }
        }
      }),
      prisma.Hospitalizado.count({
        where: {
          FechaAlta: {
            gte: startOfTodayUTC,
            lte: endOfTodayUTC
          }
        }
      })
    ]);

    // Calcular la edad y determinar el estado de Ayuno para cada paciente
    const pacientesConDatos = pacientes.map(paciente => ({
      ...paciente,
      edad: calcularEdad(paciente.FechaNacimiento),
      enAyuno: paciente.FechaFinAyuno
        ? moment(paciente.FechaFinAyuno).isAfter(startOfTodayUTC)
        : false
    }));

    // Renderizar la vista y pasar los datos
    res.render('patient/home', {
      tipoUsuario: 1,
      pacientes: pacientesConDatos,
      servicios,
      unidades,
      vias,
      regimen,
      pacientesHospitalizados,
      pacientesEnAyuno,
      ingresosHoy,
      altasHoy
    });
  } catch (error) {
    console.error('Error en renderHome:', error);
    return res.status(500).json({ message: "Internal server error: " + error });
  }
}

async function getPaciente(req,res){
    const rutCompleto = req.params.rut;
    const [rut,dv]= rutCompleto.split('-')
    try {
        const paciente = await prisma.Hospitalizado.findMany({
            where: {
                OR: [
                    { RutHospitalizado: rut },
                    { DvHospitalizado: dv }
                ]
            }
        });

        return res.status(200).json(paciente);
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
        // Verificar si `Rut` está presente en el cuerpo de la solicitud
        const rutCompleto = req.body.RutCompleto;
        if (!rutCompleto) {
            return res.status(400).json({ message: 'El campo Rut es obligatorio' });
        }

        // Extraer `rut` y `dv` del `RutCompleto`
        const [rut, dv] = rutCompleto.split('-');
        if (!rut || !dv) {
            return res.status(400).json({ message: 'Formato de RUT inválido' });
        }

        // Buscar paciente existente
        const pacienteExistente = await prisma.Hospitalizado.findFirst({
            where: {
                RutHospitalizado: rut,
                DvHospitalizado: dv
            }
        });

        const fechaIngreso = new Date().toISOString();

        if (pacienteExistente) {
            // Actualizar fecha de ingreso para paciente existente
            const pacienteActualizado = await prisma.Hospitalizado.update({
                where: { IdHospitalizado: pacienteExistente.IdHospitalizado },
                data: { FechaIngreso: fechaIngreso,
                    FechaAlta: null
                 }
            });

            // Crear log de reingreso
            await prisma.logMovimientosPaciente.create({
                data: {
                    descripcionLog: 'Paciente Reingresa al Hospital',
                    idPaciente: pacienteActualizado.IdHospitalizado,
                    fechaLog: new Date()
                }
            });

            return res.status(200).json({ message: 'Paciente reingresado exitosamente', paciente: pacienteActualizado });
        } else {
            // Crear nuevo paciente
            const nuevoPaciente = await prisma.Hospitalizado.create({
                data: {
                    CodigoCama: parseInt(req.body.CodigoCama),
                    RutHospitalizado: rut,
                    DvHospitalizado: dv,
                    NombreHospitalizado: req.body.NombreHospitalizado,
                    ApellidoP: req.body.ApellidoP,
                    ApellidoM: req.body.ApellidoM,
                    FechaNacimiento: new Date(req.body.FechaNacimiento),
                    FechaIngreso: fechaIngreso,
                    Telefono: parseInt(req.body.Telefono),
                    Direccion: req.body.Direccion,
                    Correo: req.body.Correo,
                    ObservacionesNutricionista: req.body.ObservacionesNutricionista,
                    ObservacionesSala: req.body.ObservacionesSala,
                    IdTipoServicio: parseInt(req.body.IdTipoServicio),
                    IdTipoUnidad: parseInt(req.body.IdTipoUnidad),
                    IdTipoVia: parseInt(req.body.IdTipoVia),
                    IdTipoRegimen: parseInt(req.body.IdTipoRegimen)
                }
            });

            // Crear log de ingreso
            await prisma.logMovimientosPaciente.create({
                data: {
                    descripcionLog: 'Paciente Hace Ingreso al Hospital',
                    idPaciente: nuevoPaciente.IdHospitalizado,
                    fechaLog: new Date()
                }
            });

            return res.status(200).json({ message: 'Paciente ingresado exitosamente', paciente: nuevoPaciente });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear o reingresar el paciente: ' + error.message });
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
    try {
        // Verificar si el paciente existe en la base de datos
        const paciente = await prisma.Hospitalizado.findFirst({
            where: {
                IdHospitalizado: parseInt(req.params.id)
            },
            include: {
                TipoRegimen: true
            }
        });

        // Verificar si el paciente existe
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const oldRegimen = paciente.TipoRegimen ? paciente.TipoRegimen.DescTipoRegimen : null;
        const currentRegimenId = paciente.IdTipoRegimen;
        const newRegimen = parseInt(req.body.newRegimen);

        // Obtener la lista de regímenes
        const regimens = await getRegimen();
        const newRegimenIndex = regimens.findIndex(regimen => regimen.IdTipoRegimen === newRegimen);

        // Validar si el nuevo régimen es válido
        if (newRegimenIndex === -1) {
            return res.status(400).json({ message: 'Régimen no válido' });
        }

        // Validar si el nuevo régimen es el mismo que el actual
        if (currentRegimenId === newRegimen) {
            return res.status(400).json({ message: 'El régimen no ha cambiado' });
        }

        const strRegimen = regimens[newRegimenIndex].DescTipoRegimen;

        // Actualizar el régimen del paciente
        await prisma.Hospitalizado.update({
            where: {
                IdHospitalizado: paciente.IdHospitalizado
            },
            data: {
                IdTipoRegimen: newRegimen
            }
        });

        // Registrar el movimiento del cambio de régimen
        const movimiento = await prisma.logMovimientosPaciente.create({
            data: {
                idPaciente: paciente.IdHospitalizado,
                fechaLog: new Date(),
                descripcionLog: `Cambio de régimen de ${oldRegimen} a ${strRegimen}`
            }
        });

        return res.status(200).json({ message: 'Movimiento de régimen exitoso', movimiento });
    } catch (error) {
        console.error('Error interno:', error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
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
        return res.status(200).json({ message: 'Movimiento al Observaciones de Nutricionista', movimiento });
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

async function changeVia(req, res) {
    try {
        // Verificar si el paciente existe en la base de datos
        const paciente = await prisma.Hospitalizado.findFirst({
            where: {
                IdHospitalizado: parseInt(req.params.id)
            },
            include: {
                TipoVia: true
            }
        });

        // Verificar si se encontró el paciente
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const oldVia = paciente.TipoVia ? paciente.TipoVia.DescTipoVia : null;
        const newVia = parseInt(req.body.newVia);

        // Obtener la lista de vías
        const Vias = await getVia();
        const newViaIndex = Vias.findIndex(via => via.IdTipoVia === newVia);

        // Validar si la nueva vía es válida
        if (newViaIndex === -1) {
            return res.status(400).json({ message: 'Vía no válida' });
        }

        // Validar si la nueva vía es la misma que la anterior
        if (paciente.IdTipoVia === newVia) {
            return res.status(400).json({ message: 'La vía no ha cambiado' });
        }

        const strVia = Vias[newViaIndex].DescTipoVia;

        // Actualizar la vía del paciente
        await prisma.Hospitalizado.update({
            where: {
                IdHospitalizado: paciente.IdHospitalizado
            },
            data: {
                IdTipoVia: newVia
            }
        });

        // Registrar el movimiento del cambio de vía
        const movimiento = await prisma.logMovimientosPaciente.create({
            data: {
                idPaciente: paciente.IdHospitalizado,
                fechaLog: new Date(),
                descripcionLog: `Cambio de ingesta de alimentos de ${oldVia} a ${strVia}`
            }
        });

        return res.status(200).json({ message: 'Vía de ingesta actualizada exitosamente', movimiento });
    } catch (error) {
        console.error('Error interno:', error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

async function indicarAlta(req, res) {
    try {
        const idPaciente = parseInt(req.params.id);

        // Obtener la fecha actual como objeto Date
        const today = new Date(); // Esto generará la fecha de hoy en formato Date

        const paciente = await prisma.Hospitalizado.findFirst({
            where: {
                IdHospitalizado: idPaciente
            }
        });

        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        const newPaciente = await prisma.Hospitalizado.update({
            where: {
                IdHospitalizado: idPaciente
            },
            data: {
                FechaAlta: today, // Usar el objeto Date
                CodigoCamaAlta: req.body.CodigoCamaAlta ? parseInt(req.body.CodigoCamaAlta) : null, // Convertir a int si es necesario
                ServicioAlta: req.body.ServicioAlta ? parseInt(req.body.ServicioAlta) : null, // Convertir a int si es necesario
                ObservacionesAlta: req.body.ObservacionesAlta || null
            }
        });

        // Crear un log de ingreso
        await prisma.logMovimientosPaciente.create({
            data: {
                descripcionLog: 'Paciente es dado de alta, sus observaciones son las siguientes: ' + req.body.ObservacionesAlta,
                idPaciente: newPaciente.IdHospitalizado,
                fechaLog: today  // Fecha actual
            }
        });

        return res.status(200).json({ message: 'Paciente indicado como alta', paciente: newPaciente });

    } catch (error) {
        console.error('Error interno:', error);
        return res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

async function changeFastingDate(req, res) {
    try {
        const idPaciente = parseInt(req.params.id);

        const newFastingDate = new Date(req.body.fastingDate);

        // Verificar si la fecha es válida
        if (!newFastingDate) {
            return res.status(400).json({ message: 'La fecha de ayuno no puede ser vacía' });
        }

        // Verificar si la fecha es válida
        if (!moment(newFastingDate, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({ message: 'La fecha de ayuno no es válida' });
        }

        const paciente = await prisma.Hospitalizado.update({
            where: {
                IdHospitalizado: idPaciente
            },
            data: {
                FechaFinAyuno: newFastingDate
            }
        });
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Crear un log de ingreso
        await prisma.logMovimientosPaciente.create({
            data: {
                descripcionLog: 'Paciente se ha indicado como ayuno hasta el día ' + newFastingDate,
                idPaciente: paciente.IdHospitalizado,
                fechaLog: new Date()  // Fecha actual
            }
        });

        return res.status(200).json({ message: 'Paciente indicado como ayuno hasta el día ' + newFastingDate, paciente: paciente });
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
    changeObservacionesGenerales,
    changeVia,
    indicarAlta,
    changeFastingDate,
    getPaciente
}