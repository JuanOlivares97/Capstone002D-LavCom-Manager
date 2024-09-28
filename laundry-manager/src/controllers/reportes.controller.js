const { get } = require("../routes/reportes.routes");
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
        const result = await prisma.$queryRaw`
            SELECT  
                a.id_articulo,
                a.nombre_articulo,
                s.desc_servicio,
                COALESCE(SUM(CASE WHEN r.id_tipo_registro = 1 THEN dr.cantidad ELSE 0 END), 0) - 
                COALESCE(SUM(CASE WHEN r.id_tipo_registro = 2 THEN dr.cantidad ELSE 0 END), 0) - 
                COALESCE(SUM(CASE WHEN r.id_tipo_registro = 6 THEN dr.cantidad ELSE 0 END), 0) - 
                COALESCE(SUM(CASE WHEN r.id_tipo_registro = 7 THEN dr.cantidad ELSE 0 END), 0) AS ropa_servicios
            FROM articulo a
            CROSS JOIN servicio s
            LEFT JOIN registro r ON r.id_servicio = s.id_servicio
            LEFT JOIN detalle_registro dr ON dr.id_registro = r.id_registro AND dr.id_articulo = a.id_articulo
            GROUP BY a.id_articulo, s.desc_servicio
            ORDER BY a.id_articulo, s.desc_servicio;
        `;
        console.log(result.length);
        
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
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

module.exports = {
    renderHome,
    getFullReport,
    getServicesReport,
    getBajasyPerdidas
};