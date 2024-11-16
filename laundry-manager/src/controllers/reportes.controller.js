const prisma = require("../server/prisma");

function renderHome(req, res) {
    try {
        const tipo_user = req.user["tipo_usuario"];
        return res.render('reports/home', {tipo_usuario: parseInt(tipo_user)})
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getFullReport(req, res) {
    try {
        const result = await prisma.$queryRaw`CALL ropa_disponible_hospital();`;

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

        return res.status(200).json(formattedResult);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getServicesReport(req, res) {
    try {
        const result = await prisma.$queryRaw`CALL get_services_report();   `;
        // Format the result to map the column names correctly
        const formattedResult = result.map(row => ({
            id_articulo: row.f0,
            nombre_articulo: row.f1,
            unidad_sigcom: row.f2,
            ropa_servicios: row.f3,
        }));

        return res.status(200).json(formattedResult);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error " + error });
    }
}

async function getBajasyPerdidas(req, res) {
    try {
        const result = await prisma.$queryRaw`CALL bajas_perdidas();`;

        // Format the result
        const formattedResult = result.map(row => ({
            id_articulo: row.f0,
            nombre_articulo: row.f1,
            perdidas_externas: row.f2,
            perdidas_internas: row.f3,
            perdidas_totales: row.f4,
            bajas_servicio: row.f5,
            bajas_roperia: row.f6,
            bajas_totales: row.f7
        }));

        return res.status(200).json(formattedResult);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}

async function getServicesDownReport(req, res) {
    try {
        const fecha = new Date();
        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;

        const result = await prisma.$queryRaw`
            CALL obtener_ropa_baja_servicios(${mes}, ${anio});
        `;

        const formattedResult = result.map(row => ({
            mes_anio: row.f0,
            id_articulo: row.f1,
            nombre_articulo: row.f2,
            unidad_sigcom: row.f3,
            ropa_baja_servicios: row.f4
        }));

        return res.status(200).json(formattedResult);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error: " + error });
    }
}

module.exports = {
    renderHome,
    getFullReport,
    getServicesReport,
    getBajasyPerdidas,
    getServicesDownReport
};