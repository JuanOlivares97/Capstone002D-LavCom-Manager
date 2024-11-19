const prisma = require("../server/prisma");
const {
  getServicio,
  getUnidad,
  getVia,
  getRegimen,
} = require("./maintainer.controller");
const moment = require("moment-timezone");

// Renderiza la página principal de pacientes
async function renderHome(req, res) {
  try {
    // Obtiene listas relacionadas para los selectores
    const [servicios, unidades, vias, regimen] = await Promise.all([
      getServicio(),
      getUnidad(),
      getVia(),
      getRegimen(),
    ]);

    // Consulta los pacientes que no tienen alta o cuya fecha de alta es mayor a hoy
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

    // Define las fechas de inicio y fin del día actual en la zona horaria de Chile
    const startOfTodayChile = moment().tz("America/Santiago").startOf("day");
    const endOfTodayChile = moment().tz("America/Santiago").endOf("day");

    // Convierte las fechas de inicio y fin del día a UTC para comparación
    const startOfTodayUTC = startOfTodayChile.clone().utc().toDate();
    const endOfTodayUTC = endOfTodayChile.clone().utc().toDate();

    // Calcula KPIs diarios y datos históricos
    const [pacientesHospitalizados, pacientesEnAyuno, ingresosHoy, altasHoy] =
      await Promise.all([
        // Total de pacientes hospitalizados
        prisma.Hospitalizado.count({
          where: {
            OR: [{ FechaAlta: null }, { FechaAlta: { gt: new Date() } }],
          },
        }),
        // Pacientes en ayuno
        prisma.Hospitalizado.count({
          where: {
            FechaFinAyuno: { gte: startOfTodayUTC },
            FechaAlta: null,
          },
        }),
        // Pacientes ingresados hoy
        prisma.Hospitalizado.count({
          where: {
            FechaIngreso: { gte: startOfTodayChile, lte: endOfTodayChile },
          },
        }),
        // Pacientes dados de alta hoy
        prisma.Hospitalizado.count({
          where: {
            FechaAlta: { gte: startOfTodayUTC, lte: endOfTodayUTC },
          },
        }),
      ]);

    // Calcula la edad y el estado de ayuno de cada paciente
    const pacientesConDatos = pacientes.map((paciente) => ({
      ...paciente,
      edad: calcularEdad(paciente.FechaNacimiento),
      enAyuno: paciente.FechaFinAyuno
        ? moment(paciente.FechaFinAyuno).isAfter(startOfTodayUTC)
        : false,
    }));

    const tipoUsuario = req.cookies["tipo_usuario"];

    // Renderiza la vista de pacientes con los datos obtenidos
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
    console.error("Error en renderHome:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Obtiene un paciente específico por RUT
async function getPaciente(req, res) {
  const rutCompleto = req.params.rut; // RUT en formato completo
  const [rut, dv] = rutCompleto.split("-");
  try {
    // Consulta pacientes con el RUT y DV especificados
    const paciente = await prisma.Hospitalizado.findMany({
      where: {
        OR: [{ RutHospitalizado: rut }, { DvHospitalizado: dv }],
      },
    });

    return res.status(200).json(paciente); // Devuelve el paciente encontrado
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Obtiene todos los pacientes hospitalizados
async function getPacientes(req, res) {
  try {
    // Filtra pacientes que no tienen alta o cuya fecha de alta es mayor a hoy
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
    return res.status(200).json(pacientes); // Devuelve la lista de pacientes
  } catch (error) {
    console.error("Error en getPacientes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Crea o reingresa un paciente
async function createPaciente(req, res) {
  try {
    const rutCompleto = req.body.RutCompleto; // RUT completo desde el cuerpo de la solicitud
    if (!rutCompleto) {
      return res.status(400).json({ message: "El campo Rut es obligatorio" });
    }

    const [rut, dv] = rutCompleto.split("-"); // Divide el RUT y DV
    if (!rut || !dv) {
      return res.status(400).json({ message: "Formato de RUT inválido" });
    }

    // Busca si el paciente ya existe
    const pacienteExistente = await prisma.Hospitalizado.findFirst({
      where: { RutHospitalizado: rut, DvHospitalizado: dv },
    });

    const fechaIngreso = new Date().toISOString();

    if (pacienteExistente) {
      // Si el paciente existe, actualiza su fecha de ingreso
      const pacienteActualizado = await prisma.Hospitalizado.update({
        where: { IdHospitalizado: pacienteExistente.IdHospitalizado },
        data: { FechaIngreso: fechaIngreso, FechaAlta: null },
      });

      // Registra un log de reingreso
      await prisma.logMovimientosPaciente.create({
        data: {
          descripcionLog: "Paciente Reingresa al Hospital",
          idPaciente: pacienteActualizado.IdHospitalizado,
          fechaLog: new Date(),
        },
      });

      return res.status(200).json({
        message: "Paciente reingresado exitosamente",
        paciente: pacienteActualizado,
      });
    } else {
      // Crea un nuevo paciente
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

      // Registra un log de ingreso
      await prisma.logMovimientosPaciente.create({
        data: {
          descripcionLog: "Paciente Hace Ingreso al Hospital",
          idPaciente: nuevoPaciente.IdHospitalizado,
          fechaLog: new Date(),
        },
      });

      return res.status(200).json({
        message: "Paciente ingresado exitosamente",
        paciente: nuevoPaciente,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear o reingresar el paciente" });
  }
}

// Calcula la edad de un paciente a partir de su fecha de nacimiento
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
const prisma = require("../server/prisma");
const moment = require("moment-timezone");

// Obtiene el historial de movimientos de un paciente
async function getMovimientosPaciente(req, res) {
  const idPaciente = parseInt(req.params.id); // Obtiene el ID del paciente desde los parámetros
  try {
    const movimientos = await prisma.logMovimientosPaciente.findMany({
      where: {
        idPaciente: idPaciente, // Filtra por ID del paciente
      },
    });
    return res.status(200).json(movimientos); // Devuelve el historial de movimientos
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" }); // Manejo de errores
  }
}

// Cambia el servicio asociado a un paciente
async function movePatientService(req, res) {
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: { IdHospitalizado: parseInt(req.params.id) }, // Busca al paciente por ID
      include: { TipoServicio_Hospitalizado_IdTipoServicioToTipoServicio: true }, // Incluye el servicio actual del paciente
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" }); // Si no se encuentra el paciente
    }

    const newService = parseInt(req.body.newService); // Nuevo servicio solicitado

    // Valida si el nuevo servicio es válido
    const servicios = await getServicio();
    const isValidService = servicios.some(
      (servicio) => servicio.IdTipoServicio === newService
    );

    if (!isValidService) {
      return res.status(400).json({ message: "Servicio no válido" }); // Si el servicio no es válido
    }

    // Actualiza el servicio del paciente
    const updatedPatient = await prisma.Hospitalizado.update({
      where: { IdHospitalizado: paciente.IdHospitalizado },
      data: { IdTipoServicio: newService },
    });

    return res
      .status(200)
      .json({ message: "Movimiento al Servicio exitoso", paciente: updatedPatient });
  } catch (error) {
    console.error("Error interno:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
}

// Cambia el régimen alimenticio de un paciente
async function changeRegimen(req, res) {
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: {
        IdHospitalizado: parseInt(req.params.id), // Busca al paciente por ID
      },
      include: { TipoRegimen: true }, // Incluye el régimen actual del paciente
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" }); // Si no se encuentra el paciente
    }

    const newRegimen = parseInt(req.body.newRegimen); // Nuevo régimen solicitado

    // Valida si el nuevo régimen es válido
    const regimens = await getRegimen();
    const isValidRegimen = regimens.some(
      (regimen) => regimen.IdTipoRegimen === newRegimen
    );

    if (!isValidRegimen) {
      return res.status(400).json({ message: "Régimen no válido" }); // Si el régimen no es válido
    }

    if (paciente.IdTipoRegimen === newRegimen) {
      return res.status(400).json({ message: "El régimen no ha cambiado" }); // Si el régimen no cambia
    }

    // Actualiza el régimen del paciente
    const updatedPatient = await prisma.Hospitalizado.update({
      where: { IdHospitalizado: paciente.IdHospitalizado },
      data: { IdTipoRegimen: newRegimen },
    });

    return res
      .status(200)
      .json({ message: "Cambio de régimen exitoso", paciente: updatedPatient });
  } catch (error) {
    console.error("Error interno:", error);
    return res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
}

// Cambia las observaciones de alta de un paciente
async function changeObservacionesAlta(req, res) {
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: {
        IdHospitalizado: parseInt(req.params.id), // Busca al paciente por ID
      },
    });

    const oldObservacionesAlta =
      paciente.ObservacionesAlta || "Sin Observacion"; // Observación actual de alta
    const newObservacionesAlta = req.body.newObservacionesAlta; // Nueva observación

    // Actualiza las observaciones de alta
    await prisma.Hospitalizado.update({
      where: { IdHospitalizado: paciente.IdHospitalizado },
      data: { ObservacionesAlta: newObservacionesAlta },
    });

    // Registra el cambio en el historial de movimientos
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
    return res.status(500).json({ message: "Internal server error " + error });
  }
}

// Cambia las observaciones nutricionales de un paciente
async function changeObservacionesNutricionista(req, res) {
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: {
        IdHospitalizado: parseInt(req.params.id), // Busca al paciente por ID
      },
    });

    const oldObservacionesNutricionista =
      paciente.ObservacionesNutricionista || "Sin Observacion"; // Observación actual
    const newObservacionesNutricionista =
      req.body.newObservacionesNutricionista; // Nueva observación

    // Actualiza las observaciones nutricionales
    await prisma.Hospitalizado.update({
      where: { IdHospitalizado: paciente.IdHospitalizado },
      data: { ObservacionesNutricionista: newObservacionesNutricionista },
    });

    // Registra el cambio en el historial de movimientos
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
    return res.status(500).json({ message: "Internal server error " + error });
  }
}

// Cambia la vía alimenticia de un paciente
async function changeVia(req, res) {
  try {
    const paciente = await prisma.Hospitalizado.findFirst({
      where: {
        IdHospitalizado: parseInt(req.params.id), // Busca al paciente por ID
      },
      include: { TipoVia: true }, // Incluye la vía actual
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" }); // Si no se encuentra el paciente
    }

    const oldVia = paciente.TipoVia ? paciente.TipoVia.DescTipoVia : null; // Vía actual
    const newVia = parseInt(req.body.newVia); // Nueva vía solicitada

    // Valida si la nueva vía es válida
    const Vias = await getVia();
    const newViaIndex = Vias.findIndex((via) => via.IdTipoVia === newVia);

    if (newViaIndex === -1) {
      return res.status(400).json({ message: "Vía no válida" }); // Si la vía no es válida
    }

    if (paciente.IdTipoVia === newVia) {
      return res.status(400).json({ message: "La vía no ha cambiado" }); // Si la vía no cambia
    }

    const strVia = Vias[newViaIndex].DescTipoVia;

    // Actualiza la vía del paciente
    await prisma.Hospitalizado.update({
      where: { IdHospitalizado: paciente.IdHospitalizado },
      data: { IdTipoVia: newVia },
    });

    // Registra el cambio en el historial de movimientos
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
    console.error("Error interno:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Indica que un paciente ha sido dado de alta
async function indicarAlta(req, res) {
  try {
    const idPaciente = parseInt(req.params.id); // ID del paciente
    const today = new Date(); // Fecha actual

    const paciente = await prisma.Hospitalizado.findFirst({
      where: { IdHospitalizado: idPaciente }, // Busca al paciente
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" }); // Si no se encuentra el paciente
    }

    // Actualiza la fecha de alta y otros datos
    const newPaciente = await prisma.Hospitalizado.update({
      where: { IdHospitalizado: idPaciente },
      data: {
        FechaAlta: today,
        CodigoCamaAlta: req.body.CodigoCamaAlta
          ? parseInt(req.body.CodigoCamaAlta)
          : null,
        ServicioAlta: req.body.ServicioAlta
          ? parseInt(req.body.ServicioAlta)
          : null,
        ObservacionesAlta: req.body.ObservacionesAlta || null,
      },
    });

    // Registra el cambio en el historial de movimientos
    await prisma.logMovimientosPaciente.create({
      data: {
        descripcionLog: `Paciente es dado de alta, sus observaciones son: ${req.body.ObservacionesAlta}`,
        idPaciente: newPaciente.IdHospitalizado,
        fechaLog: today,
      },
    });

    return res
      .status(200)
      .json({ message: "Paciente indicado como alta", paciente: newPaciente });
  } catch (error) {
    console.error("Error interno:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

// Cambia la fecha de fin de ayuno de un paciente
async function changeFastingDate(req, res) {
  try {
    const idPaciente = parseInt(req.params.id); // ID del paciente
    const newFastingDate = new Date(req.body.fastingDate); // Nueva fecha de ayuno

    if (!moment(newFastingDate, "YYYY-MM-DD", true).isValid()) {
      return res
        .status(400)
        .json({ message: "La fecha de ayuno no es válida" }); // Valida la fecha
    }

    // Actualiza la fecha de fin de ayuno
    const paciente = await prisma.Hospitalizado.update({
      where: { IdHospitalizado: idPaciente },
      data: { FechaFinAyuno: newFastingDate },
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" }); // Si no se encuentra el paciente
    }

    // Registra el cambio en el historial de movimientos
    await prisma.logMovimientosPaciente.create({
      data: {
        descripcionLog: `Paciente se ha indicado como ayuno hasta el día ${newFastingDate}`,
        idPaciente: paciente.IdHospitalizado,
        fechaLog: new Date(),
      },
    });

    return res.status(200).json({
      message: `Paciente indicado como ayuno hasta el día ${newFastingDate}`,
      paciente,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
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
        descripcionLog:`Cambio de Observaciones Generales: ${oldObservacionesGenerales} a ${newObservacionesGenerales}`,
      },
    });
    return res
      .status(200)
      .json({ message: "Movimiento al Observaciones Generales", movimiento });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  renderHome,
  getMovimientosPaciente,
  movePatientService,
  changeRegimen,
  changeObservacionesAlta,
  changeObservacionesNutricionista,
  changeObservacionesGenerales,
  changeVia,
  indicarAlta,
  changeFastingDate,
};

