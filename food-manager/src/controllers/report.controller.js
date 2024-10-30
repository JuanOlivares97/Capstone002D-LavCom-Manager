const prisma = require("../server/prisma");

async function renderHome(req, res) {
    try {
        const reportes = await getReports();
        res.render('report/home', { reportes, tipoUsuario: 1 });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los reportes" });
    }
}

async function getReports(){
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
        });
        return reportes;
    } catch (error) {
        console.error(error);
    }
}
module.exports = {
    renderHome
}