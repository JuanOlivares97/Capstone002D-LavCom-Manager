const prisma = require("../server/prisma");

function renderHome(req, res) {
    try {
        return res.render('reports/home')
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getFullReport(req, res) {
    try {
        const result = await prisma.$queryRaw`CALL ropa_disponible_hospital()`;

        // Format the result to map the column names correctly
        const formattedResult = result.map(row => ({
            id_articulo: row.f0,
            nombre_articulo: row.f1,
            roperia_limpio: row.f2,
            ropa_servicios: row.f3,
            roperia_sucio: row.f4,
            en_lavanderia: row.f5,
            perdidas_totales: row.f6,
            bajas_totales: row.f7
        }));

        return res.json(formattedResult);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    renderHome,
    getFullReport
}