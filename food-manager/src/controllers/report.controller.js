const prisma = require("../server/prisma");

async function renderHome(req, res) {
    try {
        const reportes = await getReports();
        const tipoUsuario = req.cookies['tipo_usuario'];
        return res.render('report/home', { reportes, tipoUsuario: parseInt(tipoUsuario) });
    } catch (error) {
        const errorMessage = `Error al obtener los reportes: ${error.message}`;
        console.error(errorMessage);
        return res.status(500).json({ message: "Error al obtener los reportes" });
    }
}

async function getReports() {
    try {
        // Obtiene el mes y año actuales
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript son 0-11, por lo que sumamos 1
        // Obtén los datos de la tabla Reportes filtrando por el mes y año actuales
        const reportes = await prisma.Reportes.findMany({
            where: {
                Anio: currentYear,
                Mes: currentMonth,
            },
            include: {
                TipoUnidad: true
            }
        });
        return reportes;
    } catch (error) {
        console.error(error);
    }
}

async function fillTable(req, res) {
    try {
        const fechaActual = new Date();
        const yearInt = fechaActual.getFullYear();
        const monthInt = fechaActual.getMonth() + 1;
        
        // Ejecuta el procedimiento almacenado y obtiene los reportes
        const reportes = await prisma.$queryRaw`CALL GenerarReporte(${monthInt}, ${yearInt});`;

        // Procesa los datos según tus necesidades
        return res.status(200).json({
            message: 'Tabla generada con éxito'
        });
    } catch (error) {
        console.error('Error al ejecutar GenerarReporte:', error);
        res.status(500).json({ message: "Error al obtener los datos" });
    }
}

async function reportHospitalizadoDiario(req, res) {
    try {
        // Obtener el número de página y el tamaño de página desde la consulta
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Calcular el desplazamiento
        const skip = (page - 1) * pageSize;

        // Obtener el inicio de hoy en UTC
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // Obtener las unidades disponibles
        const unidades = await prisma.TipoUnidad.findMany({
            select: {
                IdTipoUnidad: true,
                DescTipoUnidad: true,
            },
            where: {
                Habilitado: 'S',
            },
            orderBy: {
                DescTipoUnidad: 'asc',
            },
        });

        // Obtener los pacientes agrupados por unidad
        const reportesPorUnidad = {};

        for (const unidad of unidades) {
            const pacientes = await prisma.Hospitalizado.findMany({
                where: {
                    IdTipoUnidad: unidad.IdTipoUnidad,
                    // Agregar condición para excluir pacientes dados de alta
                    OR: [
                        { FechaAlta: null },
                        { FechaAlta: { gt: today } },
                    ],
                },
                select: {
                    CodigoCama: true,
                    RutHospitalizado: true,
                    DvHospitalizado: true,
                    NombreHospitalizado: true,
                    ApellidoP: true,
                    ApellidoM: true,
                    TipoRegimen: {
                        select: {
                            DescTipoRegimen: true,
                        },
                    },
                },
                orderBy: {
                    CodigoCama: 'asc',
                },
                skip: skip,
                take: pageSize,
            });

            // Formatear los datos de los pacientes
            const pacientesFormateados = pacientes.map((paciente) => ({
                CodigoCama: paciente.CodigoCama,
                RutPaciente: `${paciente.RutHospitalizado}-${paciente.DvHospitalizado}`,
                NombrePaciente: `${paciente.NombreHospitalizado} ${paciente.ApellidoP} ${paciente.ApellidoM}`,
                DescTipoRegimen: paciente.TipoRegimen.DescTipoRegimen,
            }));

            if (pacientesFormateados.length > 0) {
                reportesPorUnidad[unidad.DescTipoUnidad] = pacientesFormateados;
            }
        }

        // Enviar los datos al frontend para renderizar el modal
        return res.status(200).json({
            data: reportesPorUnidad,
            currentPage: page,
            pageSize: pageSize,
        });
    } catch (error) {
        console.error('Error en reportHospitalizadoDiario:', error);
        return res.status(500).json({ message: 'Error al obtener los reportes' });
    }
}

module.exports = {
    renderHome,
    fillTable,
    reportHospitalizadoDiario
}