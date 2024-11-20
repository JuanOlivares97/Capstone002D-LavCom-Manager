const prisma = require('../server/prisma');
const moment = require('moment');

// Renderiza la página de dashboard
async function renderDashboard(req, res) {
  try {
    // Obtener la fecha actual y los últimos 7 días en formato YYYY-MM-DD
    const today = new Date(); // Fecha de hoy
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i); // Retrocede 'i' días desde hoy
      return date.toISOString().split('T')[0]; // Devuelve solo la fecha en formato ISO
    }).reverse(); // Invierte el orden para mostrar del día más antiguo al más reciente

    const hoy = moment().format('YYYY-MM-DD'); // Fecha actual en formato YYYY-MM-DD usando Moment.js

    // Ejecutar consultas a la base de datos de forma paralela usando Promise.all
    const [
      funcionariosHabilitados, // Total de funcionarios habilitados
      funcionariosSolicitados, // Total de colaciones solicitadas para hoy
      funcionariosConfirmados, // Total de colaciones confirmadas para hoy
      funcionariosAlmorzaron,  // Total de colaciones consumidas para hoy
      pacientesHospitalizados, // Total de pacientes hospitalizados
      pacientesEnAyuno,        // Total de pacientes que finalizaron el ayuno antes de hoy
      ingresosHoy,             // Total de ingresos de pacientes hoy
      altasHoy,                // Total de altas de pacientes hoy
      
      // Datos históricos de colaciones confirmadas y pacientes en ayuno por día
      tendenciasColaciones,    
      
      // Datos históricos de ingresos y altas por día
      ingresosAltasSemana,

      // Distribución de tipos de régimen
      distribucionRegimen      
    ] = await Promise.all([
      // Contar el total de funcionarios habilitados
      prisma.Funcionario.count({ where: { Habilitado: "S" } }),

      // Contar colaciones solicitadas hoy con estado 0 (solicitadas)
      prisma.Colacion.count({ where: { Estado: 0, FechaSolicitud: new Date(hoy) } }),

      // Contar colaciones confirmadas hoy con estado 1 (confirmadas)
      prisma.Colacion.count({ where: { Estado: 1, FechaSolicitud: new Date(hoy) } }),

      // Contar colaciones consumidas hoy con estado 2 (almorzaron)
      prisma.Colacion.count({ where: { Estado: 2, FechaSolicitud: new Date(hoy) } }),

      // Contar el total de pacientes hospitalizados
      prisma.Hospitalizado.count(),

      // Contar pacientes que finalizaron el ayuno antes de hoy
      prisma.Hospitalizado.count({ where: { FechaFinAyuno: { lt: today } } }),

      // Contar ingresos de pacientes hoy
      prisma.Hospitalizado.count({ where: { FechaIngreso: today } }),

      // Contar altas de pacientes hoy
      prisma.Hospitalizado.count({ where: { FechaAlta: today } }),

      // Colaciones confirmadas y pacientes en ayuno por los últimos 7 días
      Promise.all(days.map(async (day) => ({
        day,
        confirmados: await prisma.Colacion.count({ where: { Estado: 0, FechaSolicitud: new Date(day) } }),
        ayuno: await prisma.Hospitalizado.count({ where: { FechaFinAyuno: { lt: new Date(day) } } })
      }))),

      // Ingresos y altas por los últimos 7 días
      Promise.all(days.map(async (day) => ({
        day,
        ingresos: await prisma.Hospitalizado.count({ where: { FechaIngreso: new Date(day) } }),
        altas: await prisma.Hospitalizado.count({ where: { FechaAlta: new Date(day) } })
      }))),

      // Agrupar pacientes por tipo de régimen y contar cada grupo
      prisma.Hospitalizado.groupBy({
        by: ['IdTipoRegimen'], // Agrupa por el campo 'IdTipoRegimen'
        _count: { IdTipoRegimen: true } // Cuenta la cantidad de pacientes por régimen
      })
    ]);

    const tipoUsuario = req.user.tipo_usuario;     // Tipo de usuario como entero

    // Renderiza la vista del dashboard con los datos obtenidos
    res.render('dashboard/home', {
      tipoUsuario: parseInt(tipoUsuario), // Convierte tipoUsuario a número entero
      funcionariosHabilitados,
      funcionariosSolicitados,
      funcionariosConfirmados,
      funcionariosAlmorzaron,
      pacientesHospitalizados,
      pacientesEnAyuno,
      ingresosHoy,
      altasHoy,
      days, // Fechas de los últimos 7 días
      tendenciasColaciones, // Datos históricos de colaciones y ayunos
      ingresosAltasSemana,  // Datos históricos de ingresos y altas
      distribucionRegimen,  // Distribución de regímene
    });
  } catch (error) {
    // Devuelve un error 500 en caso de excepciones
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  renderDashboard
};
