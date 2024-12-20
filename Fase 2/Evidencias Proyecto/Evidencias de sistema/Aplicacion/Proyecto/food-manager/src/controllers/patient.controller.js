const prisma = require("../server/prisma");
const {
  getServicio,
  getUnidad,
  getVia,
  getRegimen,
} = require("./maintainer.controller");
const moment = require("moment-timezone");

async function renderHome(req, res) {
  try {
    const [servicios, unidades, vias, regimen] = await Promise.all([
      getServicio(),
      getUnidad(),
      getVia(),
      getRegimen(),
    ]);

    // Obtener los pacientes con las condiciones especificadas
    const pacientes = await prisma.Hospitalizado.findMany({
      where: {
        OR: [{ FechaAlta: null }, { FechaAlta: { gt: new Date() } }],
      },
      include: {
        TipoRegimen: true,
        TipoUnidad: true,
        TipoVia: true,
        logMovimientosPaciente: true,
      },
      orderBy: [
        { IdTipoServicio: 'asc' }, // Ordenar primero por tipo de servicio
        { CodigoCama: 'asc' },     // Luego ordenar por número de cama dentro del tipo de servicio
      ],
    });

    // Obtener la fecha actual en la zona horaria de Chile y definir el inicio y fin del día
    const startOfTodayChile = moment().tz("America/Santiago").startOf("day");
    const endOfTodayChile = moment().tz("America/Santiago").endOf("day");

    // Convertir el inicio y fin del día a UTC para comparar con fechas en UTC en la base de datos
    const startOfTodayUTC = startOfTodayChile.clone().utc().toDate();
    const endOfTodayUTC = endOfTodayChile.clone().utc().toDate();

    // KPIs diarios y datos históricos comparando solo fechas
    const [pacientesHospitalizados, pacientesEnAyuno, ingresosHoy, altasHoy] =
      await Promise.all([
        prisma.Hospitalizado.count({
          where: {
            OR: [{ FechaAlta: null }, { FechaAlta: { gt: new Date() } }],
          },
        }),
        prisma.Hospitalizado.count({
          where: {
            FechaFinAyuno: {
              // Comparamos si la fecha de fin de ayuno es posterior o igual al inicio del día actual en Chile (UTC)
              gte: startOfTodayUTC,
            },
            FechaAlta: null,
          },
        }),
        prisma.Hospitalizado.count({
          where: {
            FechaIngreso: {
              gte: startOfTodayChile,
              lte: endOfTodayChile,
            },
          },
        }),
        prisma.Hospitalizado.count({
          where: {
            FechaAlta: {
              gte: startOfTodayUTC,
              lte: endOfTodayUTC,
            },
          },
        }),
      ]);

    // Calcular la edad y determinar el estado de Ayuno para cada paciente
    const pacientesConDatos = pacientes.map((paciente) => ({
      ...paciente,
      nombreCompleto: [
        paciente.NombreHospitalizado ?? '',
        paciente.ApellidoP ?? '',
        paciente.ApellidoM ?? ''
      ].filter(Boolean).join(' '),
      edad: calcularEdad(paciente.FechaNacimiento),
      enAyuno: paciente.FechaFinAyuno
        ? moment(paciente.FechaFinAyuno).isAfter(startOfTodayUTC)
        : false,
    }));

    const tipoUsuario = req.user.tipo_usuario;

    // Renderizar la vista y pasar los datos
    res.render("patient/home", {
      tipoUsuario: parseInt(tipoUsuario),
      pacientes: pacientesConDatos,
      servicios,
      unidades,
      vias,
      regimen,
      pacientesHospitalizados,
      pacientesEnAyuno,
      ingresosHoy,
      altasHoy,
    });
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getPaciente(req, res) {
  const rutCompleto = req.params.rut;
  const [rut, dv] = rutCompleto.split("-");
  try {
    const paciente = await prisma.Hospitalizado.findMany({
      where: {
        OR: [{ RutHospitalizado: rut }, { DvHospitalizado: dv }],
      },
    });

    return res.status(200).json(paciente);
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getPacientes(req, res) {
  try {
    const pacientes = await prisma.Hospitalizado.findMany({
      where: {
        OR: [{ FechaAlta: null }, { FechaAlta: { gt: new Date() } }],
      },
      include: {
        TipoRegimen: true,
        TipoUnidad: true,
        TipoVia: true,
        logMovimientosPaciente: true,
      },
    });
    return res.status(200).json(pacientes);
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function editPaciente(req, res) {
  try {
      const { id, nombre, apellidoP, apellidoM, telefono, correo, direccion } = req.body;

      // Validar que los datos requeridos estén presentes
      if (!id || !nombre || !apellidoP || !apellidoM || !direccion) {
          return res.status(400).json({ message: 'Faltan datos obligatorios para editar el paciente.' });
      }

      // Buscar el paciente por ID
      const paciente = await prisma.Hospitalizado.findUnique({
          where: {
              IdHospitalizado: parseInt(id)
          }
      });

      if (!paciente) {
          return res.status(404).json({ message: 'Paciente no encontrado.' });
      }

      // Actualizar solo los datos personales permitidos
      const updatedPaciente = await prisma.Hospitalizado.update({
          where: {
              IdHospitalizado: parseInt(id)
          },
          data: {
              NombreHospitalizado: nombre,
              ApellidoP: apellidoP,
              ApellidoM: apellidoM,
              Telefono: telefono ? parseInt(telefono) : null,
              Correo: correo || null,
              Direccion: direccion
          }
      });

      return res.status(200).json({ message: 'Paciente actualizado exitosamente.', paciente: updatedPaciente });
  } catch (error) {
      await prisma.error_log.create({
          data: {
              id_usuario: null,
              tipo_error: "Error interno del servidor",
              mensaje_error: JSON.stringify(error),
              ruta_error: "hospitalizado/editPaciente",
              codigo_http: 500
          }
      });
      return res.status(500).json({ message: 'Error al editar el paciente: ' + error });
  }
}


async function createPaciente(req, res) {
  try {
    // Verificar si `Rut` está presente en el cuerpo de la solicitud
    const rutCompleto = req.body.RutCompleto;
    if (!rutCompleto) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "El campo Rut es obligatorio",
          ruta_error: "food-manager/patient/home",
          codigo_http: 400
        }
      });
      return res.status(400).json({ message: "El campo Rut es obligatorio" });
    }

    // Extraer `rut` y `dv` del `RutCompleto`
    const [rut, dv] = rutCompleto.split("-");
    if (!rut || !dv) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "Formato de RUT inválido",
          ruta_error: "food-manager/patient/home",
          codigo_http: 400
        }
      });
      return res.status(400).json({ message: "Formato de RUT inválido" });
    }

    // Buscar paciente existente
    const pacienteExistente = await prisma.Hospitalizado.findFirst({
      where: {
        RutHospitalizado: rut,
        DvHospitalizado: dv,
      },
    });

    const fechaIngreso = new Date().toISOString();

    if (pacienteExistente) {
      // Actualizar fecha de ingreso para paciente existente
      const pacienteActualizado = await prisma.Hospitalizado.update({
        where: { IdHospitalizado: pacienteExistente.IdHospitalizado },
        data: { FechaIngreso: fechaIngreso, FechaAlta: null },
      });

      // Crear log de reingreso
      await prisma.logMovimientosPaciente.create({
        data: {
          descripcionLog: "Paciente Reingresa al Hospital",
          idPaciente: pacienteActualizado.IdHospitalizado,
          fechaLog: new Date(),
        },
      });

      return res
        .status(200)
        .json({
          message: "Paciente reingresado exitosamente",
          paciente: pacienteActualizado,
        });
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
          IdTipoRegimen: parseInt(req.body.IdTipoRegimen),
        },
      });

      // Crear log de ingreso
      await prisma.logMovimientosPaciente.create({
        data: {
          descripcionLog: "Paciente Hace Ingreso al Hospital",
          idPaciente: nuevoPaciente.IdHospitalizado,
          fechaLog: new Date(),
        },
      });

      return res
        .status(200)
        .json({
          message: "Paciente ingresado exitosamente",
          paciente: nuevoPaciente,
        });
    }
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: "Error al crear o reingresar el paciente" });
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
        idPaciente: idPaciente,
      },
    });
    return res.status(200).json(movimientos);
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function movePatientService(req, res) {
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: { IdHospitalizado: parseInt(req.params.id) },
      include: { TipoServicio_Hospitalizado_IdTipoServicioToTipoServicio: true }
    });

    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    const newService = parseInt(req.body.newService);

    // Obtén la lista de servicios válidos
    const servicios = await getServicio();
    const isValidService = servicios.some(servicio => servicio.IdTipoServicio === newService);

    // Si el nuevo servicio no es válido, devuelve un error 400
    if (!isValidService) {
      return res.status(400).json({ message: 'Servicio no válido' });
    }

    const newCodigoCama = req.body.newCodigoCama ? parseInt(req.body.newCodigoCama) : null;
    const oldCodigoCama = paciente.CodigoCama;

    // Actualizar el servicio del paciente si es válido
    const updatedPatient = await prisma.Hospitalizado.update({
      where: { IdHospitalizado: paciente.IdHospitalizado },
      data: { IdTipoServicio: newService, CodigoCama: newCodigoCama }
    });

    let log;

    // Si el servicio es el mismo, solo registrar cambio de cama si hay
    if (paciente.IdTipoServicio === newService) {
      if (oldCodigoCama !== newCodigoCama) {
        log = await prisma.logMovimientosPaciente.create({
          data: {
            descripcionLog: `Cambio de Cama: ${oldCodigoCama} a ${newCodigoCama}`,
            fechaLog: new Date(),
            idPaciente: paciente.IdHospitalizado
          }
        });
      }
    } else {
      // Si el servicio es diferente, registrar cambio de servicio y cama si hay
      let descripcion = `Movimiento al Servicio: ${paciente.TipoServicio_Hospitalizado_IdTipoServicioToTipoServicio.DescTipoServicio} a ${servicios.find(servicio => servicio.IdTipoServicio === newService).DescTipoServicio}`;

      if (oldCodigoCama !== newCodigoCama) {
        descripcion += ` y Cambio de Cama: ${oldCodigoCama} a ${newCodigoCama}`;
      }

      log = await prisma.logMovimientosPaciente.create({
        data: {
          descripcionLog: descripcion,
          fechaLog: new Date(),
          idPaciente: paciente.IdHospitalizado
        }
      });
    }

    return res.status(200).json({
      message: 'Movimiento realizado exitosamente',
      log: log
    });
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}

async function movePatientUnidad(req, res) {
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: { IdHospitalizado: parseInt(req.params.id) },
      include: { TipoUnidad: true }
    });

    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    const newUnidad = parseInt(req.body.newUnidad);

    // Obtén la lista de servicios válidos
    const unidad = await getUnidad();
    const isValidUnidad = unidad.some(unidad => unidad.IdTipoUnidad === newUnidad);

    // Si el nuevo servicio no es válido, devuelve un error 400
    if (!isValidUnidad) {
      return res.status(400).json({ message: 'Servicio no válido' });
    }

    // Actualizar el servicio del paciente si es válido
    const updatedPatient = await prisma.Hospitalizado.update({
      where: { IdHospitalizado: paciente.IdHospitalizado },
      data: { IdTipoUnidad: newUnidad }
    });

    let log;

    // Si el servicio es el mismo, solo registrar cambio de cama si hay
    if (paciente.IdTipoUnidad === newUnidad) {
      // Si el servicio es diferente, registrar cambio de servicio y cama si hay
      let descripcion = `Movimiento al Servicio: ${paciente.TipoUnidad.DescTipoUnidad} a ${unidad.find(unidad => unidad.IdTipoUnidad === newUnidad).DescTipoUnidad}`;

      log = await prisma.logMovimientosPaciente.create({
        data: {
          descripcionLog: descripcion,
          fechaLog: new Date(),
          idPaciente: paciente.IdHospitalizado
        }
      });
    }

    return res.status(200).json({
      message: 'Movimiento realizado exitosamente',
      log: log
    });
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}

async function changeRegimen(req, res) {
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: {
        IdHospitalizado: parseInt(req.params.id),
      },
      include: {
        TipoRegimen: true,
      },
    });

    if (!paciente) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "Paciente no encontrado",
          ruta_error: "food-manager/patient/home",
          codigo_http: 404
        }
      });
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const newRegimen = parseInt(req.body.newRegimen);

    // Obtén la lista de regímenes válidos
    const regimens = await getRegimen();
    const isValidRegimen = regimens.some(
      (regimen) => regimen.IdTipoRegimen === newRegimen
    );

    // Si el nuevo régimen no es válido, devuelve un error 400
    if (!isValidRegimen) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "Régimen no válido",
          ruta_error: "food-manager/patient/home",
          codigo_http: 400
        }
      });
      return res.status(400).json({ message: "Régimen no válido" });
    }

    // Verifica si el nuevo régimen es el mismo que el actual
    if (paciente.IdTipoRegimen === newRegimen) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "El régimen no ha cambiado",
          ruta_error: "food-manager/patient/home",
          codigo_http: 400
        }
      });
      return res.status(400).json({ message: "El régimen no ha cambiado" });
    }

    const updatedPatient = await prisma.Hospitalizado.update({
      where: { IdHospitalizado: paciente.IdHospitalizado },
      data: { IdTipoRegimen: newRegimen },
    });

    return res
      .status(200)
      .json({ message: "Cambio de régimen exitoso", paciente: updatedPatient });
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
}

async function changeObservacionesAlta(req, res) {
  // Verificar si el paciente existe en la base de datos
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: {
        IdHospitalizado: parseInt(req.params.id),
      },
    });
    const oldObservacionesAlta =
      paciente.ObservacionesAlta || "Sin Observacion";
    const newObservacionesAlta = req.body.newObservacionesAlta;

    // Actualizar el servicio del paciente
    await prisma.Hospitalizado.update({
      where: {
        IdHospitalizado: paciente.IdHospitalizado,
      },
      data: {
        ObservacionesAlta: newObservacionesAlta,
      },
    });
    const movimiento = await prisma.logMovimientosPaciente.create({
      data: {
        idPaciente: paciente.IdHospitalizado,
        fechaLog: new Date(),
        descripcionLog: `Cambio de Observaciones de Alta: ${oldObservacionesAlta} a ${newObservacionesAlta}`,
      },
    });
    return res
      .status(200)
      .json({ message: "Movimiento al Observaciones de Alta", movimiento });
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: "Internal server error " + error });
  }
}

async function changeObservacionesNutricionista(req, res) {
  // Verificar si el paciente existe en la base de datos
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: {
        IdHospitalizado: parseInt(req.params.id),
      },
    });
    const oldObservacionesNutricionista =
      paciente.ObservacionesNutricionista || "Sin Observacion";
    const newObservacionesNutricionista =
      req.body.newObservacionesNutricionista;
    // Actualizar el servicio del paciente
    await prisma.Hospitalizado.update({
      where: {
        IdHospitalizado: paciente.IdHospitalizado,
      },
      data: {
        ObservacionesNutricionista: newObservacionesNutricionista,
      },
    });
    const movimiento = await prisma.logMovimientosPaciente.create({
      data: {
        idPaciente: paciente.IdHospitalizado,
        fechaLog: new Date(),
        descripcionLog: `Cambio de Observaciones Nutricionista: ${oldObservacionesNutricionista} a ${newObservacionesNutricionista}`,
      },
    });
    return res
      .status(200)
      .json({
        message: "Movimiento al Observaciones de Nutricionista",
        movimiento,
      });
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: "Internal server error " + error });
  }
}

async function changeObservacionesGenerales(req, res) {
  // Verificar si el paciente existe en la base de datos
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: {
        IdHospitalizado: parseInt(req.params.id),
      },
    });
    const oldObservacionesGenerales =
      paciente.ObservacionesGenerales || "Sin Observacion";
    const newObservacionesGenerales = req.body.newObservacionesGenerales;
    // Actualizar el servicio del paciente
    await prisma.Hospitalizado.update({
      where: {
        IdHospitalizado: paciente.IdHospitalizado,
      },
      data: {
        ObservacionesSala: newObservacionesGenerales,
      },
    });
    const movimiento = await prisma.logMovimientosPaciente.create({
      data: {
        idPaciente: paciente.IdHospitalizado,
        fechaLog: new Date(),
        descripcionLog: `Cambio de Observaciones Generales: ${oldObservacionesGenerales} a ${newObservacionesGenerales}`,
      },
    });
    return res
      .status(200)
      .json({ message: "Movimiento al Observaciones Generales", movimiento });
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function changeVia(req, res) {
  try {
    // Verificar si el paciente existe en la base de datos
    const paciente = await prisma.Hospitalizado.findFirst({
      where: {
        IdHospitalizado: parseInt(req.params.id),
      },
      include: {
        TipoVia: true,
      },
    });

    // Verificar si se encontró el paciente
    if (!paciente) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "Paciente no encontrado",
          ruta_error: "food-manager/patient/home",
          codigo_http: 404
        }
      });
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const oldVia = paciente.TipoVia ? paciente.TipoVia.DescTipoVia : null;
    const newVia = parseInt(req.body.newVia);

    // Obtener la lista de vías
    const Vias = await getVia();
    const newViaIndex = Vias.findIndex((via) => via.IdTipoVia === newVia);

    // Validar si la nueva vía es válida
    if (newViaIndex === -1) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "Vía no válida",
          ruta_error: "food-manager/patient/home",
          codigo_http: 400
        }
      });
      return res.status(400).json({ message: "Vía no válida" });
    }

    // Validar si la nueva vía es la misma que la anterior
    if (paciente.IdTipoVia === newVia) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "La vía no ha cambiado",
          ruta_error: "food-manager/patient/home",
          codigo_http: 400
        }
      });
      return res.status(400).json({ message: "La vía no ha cambiado" });
    }

    const strVia = Vias[newViaIndex].DescTipoVia;

    // Actualizar la vía del paciente
    await prisma.Hospitalizado.update({
      where: {
        IdHospitalizado: paciente.IdHospitalizado,
      },
      data: {
        IdTipoVia: newVia,
      },
    });

    // Registrar el movimiento del cambio de vía
    const movimiento = await prisma.logMovimientosPaciente.create({
      data: {
        idPaciente: paciente.IdHospitalizado,
        fechaLog: new Date(),
        descripcionLog: `Cambio de ingesta de alimentos de ${oldVia} a ${strVia}`,
      },
    });

    return res
      .status(200)
      .json({ message: "Vía de ingesta actualizada exitosamente", movimiento });
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function indicarAlta(req, res) {
  try {
    const idPaciente = parseInt(req.params.id);

    // Obtener la fecha actual como objeto Date
    const today = new Date(); // Esto generará la fecha de hoy en formato Date

    const paciente = await prisma.Hospitalizado.findFirst({
      where: {
        IdHospitalizado: idPaciente,
      },
    });

    if (!paciente) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "Paciente no encontrado",
          ruta_error: "food-manager/patient/home",
          codigo_http: 404
        }
      });
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const newPaciente = await prisma.Hospitalizado.update({
      where: {
        IdHospitalizado: idPaciente,
      },
      data: {
        FechaAlta: today, // Usar el objeto Date
        CodigoCamaAlta: req.body.CodigoCamaAlta
          ? parseInt(req.body.CodigoCamaAlta)
          : null, // Convertir a int si es necesario
        ServicioAlta: req.body.ServicioAlta
          ? parseInt(req.body.ServicioAlta)
          : null, // Convertir a int si es necesario
        ObservacionesAlta: req.body.ObservacionesAlta || null,
      },
    });

    // Crear un log de ingreso
    await prisma.logMovimientosPaciente.create({
      data: {
        descripcionLog:
          "Paciente es dado de alta, sus observaciones son las siguientes: " +
          req.body.ObservacionesAlta,
        idPaciente: newPaciente.IdHospitalizado,
        fechaLog: today, // Fecha actual
      },
    });

    return res
      .status(200)
      .json({ message: "Paciente indicado como alta", paciente: newPaciente });
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

async function changeFastingDate(req, res) {
  try {
    const idPaciente = parseInt(req.params.id);

    const newFastingDate = new Date(req.body.fastingDate);

    // Verificar si la fecha es válida
    if (!newFastingDate) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "La fecha de ayuno no puede ser vacía",
          ruta_error: "food-manager/patient/home",
          codigo_http: 400
        }
      });
      return res
        .status(400)
        .json({ message: "La fecha de ayuno no puede ser vacía" });
    }

    // Verificar si la fecha es válida
    if (!moment(newFastingDate, "YYYY-MM-DD", true).isValid()) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "La fecha de ayuno no es válida",
          ruta_error: "food-manager/patient/home",
          codigo_http: 400
        }
      });
      return res
        .status(400)
        .json({ message: "La fecha de ayuno no es válida" });
    }

    const paciente = await prisma.Hospitalizado.update({
      where: {
        IdHospitalizado: idPaciente,
      },
      data: {
        FechaFinAyuno: newFastingDate,
      },
    });
    if (!paciente) {
      const error_log = await prisma.error_log.create({
        data: {
          id_usuario: req.user["id_usuario"] || null,
          tipo_error: "Error interno del servidor",
          mensaje_error: "Paciente no encontrado",
          ruta_error: "food-manager/patient/home",
          codigo_http: 404
        }
      });
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    // Crear un log de ingreso
    await prisma.logMovimientosPaciente.create({
      data: {
        descripcionLog:
          "Paciente se ha indicado como ayuno hasta el día " + newFastingDate,
        idPaciente: paciente.IdHospitalizado,
        fechaLog: new Date(), // Fecha actual
      },
    });

    return res
      .status(200)
      .json({
        message: "Paciente indicado como ayuno hasta el día " + newFastingDate,
        paciente: paciente,
      });
  } catch (error) {
    const error_log = await prisma.error_log.create({
      data: {
        id_usuario: req.user["id_usuario"] || null,
        tipo_error: "Error interno del servidor",
        mensaje_error: JSON.stringify(error),
        ruta_error: "food-manager/patient/home",
        codigo_http: 500
      }
    });
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function removeFastingDate(req, res) {
  try {
    const idPaciente = parseInt(req.params.id);

    const paciente = await prisma.Hospitalizado.update({
      where: {
        IdHospitalizado: idPaciente,
      },
      data: {
        FechaFinAyuno: null, // Quitar el ayuno
      },
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    // Crear un log de movimiento
    await prisma.logMovimientosPaciente.create({
      data: {
        descripcionLog: "Paciente ya no está en ayuno",
        idPaciente: paciente.IdHospitalizado,
        fechaLog: new Date(), // Fecha actual
      },
    });

    return res.status(200).json({
      message: "El ayuno ha sido quitado para el paciente",
      paciente: paciente,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
  getPaciente,
  movePatientUnidad,
  removeFastingDate,
  editPaciente
};
