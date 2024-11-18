const prisma = require("../server/prisma");

async function renderHome(req, res) {
    try {
        const tipo_user = req.user["tipo_usuario"];

        const unidadMasPedidos = await prisma.$queryRaw`
            SELECT 
                us.unidad_sigcom, 
                SUM(dr.cantidad) as total_solicitado
            FROM registro r
            JOIN unidad_sigcom us ON r.id_unidad_sigcom = us.id_unidad_sigcom
            JOIN detalle_registro dr ON r.id_registro = dr.id_registro
            JOIN articulo a ON dr.id_articulo = a.id_articulo
            WHERE r.id_tipo_registro = 1
            GROUP BY us.unidad_sigcom
            ORDER BY total_solicitado DESC;
        `;

        const unidadMasPerdidas = await prisma.$queryRaw`
            SELECT 
                us.unidad_sigcom, 
                SUM(dr.cantidad) as total_perdido
            FROM registro r
            JOIN unidad_sigcom us ON r.id_unidad_sigcom = us.id_unidad_sigcom
            JOIN detalle_registro dr ON r.id_registro = dr.id_registro
            JOIN articulo a ON dr.id_articulo = a.id_articulo
            WHERE r.id_tipo_registro = 6
            GROUP BY us.unidad_sigcom
            ORDER BY total_perdido DESC;
        `;

        const unidadMasBajas = await prisma.$queryRaw`
            SELECT 
                us.unidad_sigcom, 
                SUM(dr.cantidad) as total_baja
            FROM registro r
            JOIN unidad_sigcom us ON r.id_unidad_sigcom = us.id_unidad_sigcom
            JOIN detalle_registro dr ON r.id_registro = dr.id_registro
            JOIN articulo a ON dr.id_articulo = a.id_articulo
            WHERE r.id_tipo_registro = 7
            GROUP BY us.unidad_sigcom
            ORDER BY total_baja DESC;
        `;

        const articulosMasPedidos = await prisma.$queryRaw`
            SELECT 
                a.nombre_articulo, 
                SUM(dr.cantidad) as total_pedido
            FROM registro r
            JOIN detalle_registro dr ON r.id_registro = dr.id_registro
            JOIN articulo a ON dr.id_articulo = a.id_articulo
            WHERE r.id_tipo_registro = 1
            GROUP BY a.nombre_articulo
            ORDER BY total_pedido DESC;
        `;

        const articulosMasPerdidos = await prisma.$queryRaw`
        SELECT 
            a.nombre_articulo, 
            SUM(dr.cantidad) as total_perdido
        FROM registro r
        JOIN detalle_registro dr ON r.id_registro = dr.id_registro
        JOIN articulo a ON dr.id_articulo = a.id_articulo
        WHERE r.id_tipo_registro = 5 OR r.id_tipo_registro = 6
        GROUP BY a.nombre_articulo
        ORDER BY total_perdido DESC;
        `;

        const articulosMasBajas = await prisma.$queryRaw`
        SELECT 
            a.nombre_articulo, 
            SUM(dr.cantidad) as total_baja
        FROM registro r
        JOIN detalle_registro dr ON r.id_registro = dr.id_registro
        JOIN articulo a ON dr.id_articulo = a.id_articulo
        WHERE r.id_tipo_registro = 7 OR r.id_tipo_registro = 8
        GROUP BY a.nombre_articulo
        ORDER BY total_baja DESC;
        `;

        // Renderizar la vista con datos corregidos
        return res.status(200).render("dashboard/home", {
            tipo_usuario: tipo_user,
            unidadMasPedidos,
            unidadMasPerdidas,
            unidadMasBajas,
            articulosMasPedidos,
            articulosMasPerdidos,
            articulosMasBajas
        });

    } catch (error) {
        console.error("Error al renderizar el dashboard: ", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

module.exports = {
    renderHome,
};
