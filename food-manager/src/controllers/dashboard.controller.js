const prisma = require('../server/prisma');
const moment = require('moment');

async function renderDashboard(req, res) {
  try {
    // Obtener la fecha actual y los últimos 7 días en formato YYYY-MM-DD
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    const hoy = moment().format('YYYY-MM-DD');
    // Promesas para KPIs diarios y datos históricos
    const [
      funcionariosHabilitados,
      funcionariosSolicitados,
      funcionariosConfirmados,
      funcionariosAlmorzaron,
      pacientesHospitalizados,
      pacientesEnAyuno,
      ingresosHoy,
      altasHoy,
      tendenciasColaciones,
      ingresosAltasSemana,
      distribucionRegimen
    ] = await Promise.all([
      prisma.Funcionario.count({ where: { Habilitado: "S" } }),
      prisma.Colacion.count({ where: { Estado: 0, FechaSolicitud: new Date(hoy) } }),
      prisma.Colacion.count({ where: { Estado: 1, FechaSolicitud: new Date(hoy) } }),
      prisma.Colacion.count({ where: { Estado: 2, FechaSolicitud: new Date(hoy) } }),
      prisma.Hospitalizado.count(),
      prisma.Hospitalizado.count({ where: { FechaFinAyuno: { lt: today } } }),
      prisma.Hospitalizado.count({ where: { FechaIngreso: today } }),
      prisma.Hospitalizado.count({ where: { FechaAlta: today } }),
      
      // Colaciones confirmadas y pacientes en ayuno por día
      Promise.all(days.map(async (day) => ({
        day,
        confirmados: await prisma.Colacion.count({ where: { Estado: 0, FechaSolicitud: new Date(day) } }),
        ayuno: await prisma.Hospitalizado.count({ where: { FechaFinAyuno: { lt: new Date(day) } } })
      }))),

      // Ingresos y altas por día
      Promise.all(days.map(async (day) => ({
        day,
        ingresos: await prisma.Hospitalizado.count({ where: { FechaIngreso: new Date(day) } }),
        altas: await prisma.Hospitalizado.count({ where: { FechaAlta: new Date(day) } })
      }))),

      // Distribución de tipos de régimen
      prisma.Hospitalizado.groupBy({
        by: ['IdTipoRegimen'],
        _count: {
          IdTipoRegimen: true
        }
      })
    ]);
    const tipoUsuariostr = req.cookies['tipo_usuarioStr']
    const nombreUsuario = req.cookies['NombreUsuario']
    const tipoUsuario = req.cookies['tipo_usuario']
    res.render('dashboard/home', {
      tipoUsuario: parseInt(tipoUsuario),
      funcionariosHabilitados,
      funcionariosSolicitados,
      funcionariosConfirmados,
      funcionariosAlmorzaron,
      pacientesHospitalizados,
      pacientesEnAyuno,
      ingresosHoy,
      altasHoy,
      days,
      tendenciasColaciones,
      ingresosAltasSemana,
      distribucionRegimen,
      tipoUsuariostr,
      nombreUsuario
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  renderDashboard
};