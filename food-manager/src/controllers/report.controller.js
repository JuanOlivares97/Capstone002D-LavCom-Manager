const prisma = require("../server/prisma");
const {
    getServicio,
    getUnidad,
    getVia,
    getRegimen,
  } = require("./maintainer.controller");
async function renderHome(req, res) {
    try {
        const reportes = await getReports();
        const tipoUsuario = req.user.tipo_usuario;
        const unidades = await getUnidad();
        return res.render('report/home', { reportes, tipoUsuario: parseInt(tipoUsuario), unidades });
    } catch (error) {
        const error_log = await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/report/home",
                codigo_http: 500
            }
        });
        return res.status(500).json({ message: "Error al obtener los reportes" });
    }
}

async function getReports() {
    try {
        // Calcular los últimos 6 meses desde la fecha actual
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
        const currentYear = currentDate.getFullYear();
        
        // Calcular el rango de meses y años
        const months = [];
        const years = [];
        for (let i = 0; i < 6; i++) {
            let month = currentMonth - i;
            let year = currentYear;
            if (month <= 0) {
                month += 12;
                year -= 1;
            }
            months.push(month);
            years.push(year);
        }
        
        // Obtener los reportes filtrados por mes y año
        const reportes = await prisma.Reportes.findMany({
            where: {
                OR: months.map((month, index) => ({
                    Mes: month,
                    Anio: years[index]
                }))
            },
            include: {
                TipoUnidad: true
            }
        });
        return reportes;
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req?.user?.id_usuario || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/report/home",
                codigo_http: 500
            }
        });
        throw error; // Relanzar el error para que sea manejado en el controlador principal
    }
}


async function fillTable(req, res) {
    try {
        const { mes, anio } = req.query;

        // Validar que los parámetros sean válidos
        if (!mes || !anio || isNaN(mes) || isNaN(anio)) {
            return res.status(400).json({ message: "Mes y año son requeridos y deben ser números válidos." });
        }

        const monthInt = parseInt(mes);
        const yearInt = parseInt(anio);

        // Verifica que el mes esté en el rango correcto
        if (monthInt < 1 || monthInt > 12) {
            return res.status(400).json({ message: "El mes debe estar entre 1 y 12." });
        }

        // Ejecuta el procedimiento almacenado
        await prisma.$queryRaw`CALL GenerarReporte(${monthInt}, ${yearInt});`;

        // Respuesta exitosa
        return res.status(200).json({
            message: `Tabla generada con éxito para el mes ${monthInt}/${yearInt}`
        });
    } catch (error) {
        // Registrar el error
        await prisma.error_log.create({
            data: {
                id_usuario: req?.user?.id_usuario || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "food-manager/report/fill-table",
                codigo_http: 500
            }
        });

        // Respuesta de error
        res.status(500).json({ message: "Error al generar el reporte." });
    }
}


// Endpoint para obtener el reporte por unidad
async function reportHospitalizadoDiario(req, res) {
    try {
        // Obtener las unidades habilitadas
        const unidades = await prisma.TipoUnidad.findMany({
            select: {
                IdTipoUnidad: true,
                DescTipoUnidad: true,
            },
            where: { Habilitado: 'S' },
            orderBy: { DescTipoUnidad: 'asc' },
        });

        // Crear un objeto para almacenar reportes por unidad
        const reportes = {};

        // Iterar por cada unidad para buscar los pacientes hospitalizados
        for (const unidad of unidades) {
            const pacientes = await prisma.Hospitalizado.findMany({
                where: {
                    IdTipoUnidad: unidad.IdTipoUnidad,
                    OR: [
                        { FechaAlta: null },
                        { FechaAlta: { gt: new Date() } },
                    ],
                },
                select: {
                    CodigoCama: true,
                    RutHospitalizado: true,
                    DvHospitalizado: true,
                    NombreHospitalizado: true,
                    ApellidoP: true,
                    ApellidoM: true,
                    ObservacionesNutricionista: true,
                    TipoRegimen: {
                        select: { DescTipoRegimen: true },
                    },
                },
                orderBy: { CodigoCama: 'asc' },
            });

            // Formatear los pacientes
            const pacientesFormateados = pacientes.map((paciente) => ({
                CodigoCama: paciente.CodigoCama,
                RutPaciente: `${paciente.RutHospitalizado}-${paciente.DvHospitalizado}`,
                NombrePaciente: `${paciente.NombreHospitalizado} ${paciente.ApellidoP} ${paciente.ApellidoM}`,
                DescTipoRegimen: paciente.TipoRegimen?.DescTipoRegimen || 'No especificado',
                ObservacionesNutricionista: paciente.ObservacionesNutricionista || '-',
            }));

            // Añadir la unidad solo si tiene pacientes
            if (pacientesFormateados.length > 0) {
                reportes[unidad.DescTipoUnidad] = pacientesFormateados;
            }
        }

        // Enviar respuesta al frontend
        res.status(200).json({ data: reportes });
    } catch (error) {
        console.error("Error en el servidor:", error);
        await prisma.error_log.create({
            data: {
                id_usuario: req.user?.id_usuario || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: req.originalUrl,
                codigo_http: 500,
            },
        });
        res.status(500).json({ message: "Error al obtener los reportes por unidad" });
    }
}


module.exports = {
    renderHome,
    fillTable,
    reportHospitalizadoDiario
}