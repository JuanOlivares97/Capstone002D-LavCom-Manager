const prisma = require("../server/prisma");

// FUNCION PARA RENDERIZAR LA VISTA PRINCIPAL (HOME)
async function renderHome(req, res) {
    try {
        // Obtener tipo de usuario desde el objeto de usuario en la solicitud
        const tipo_user = req.user["tipo_usuario"];

        // Consultas para obtener datos para el dashboard (unidades y artículos más solicitados, perdidos y dados de baja)
        
        // Unidades más solicitadas
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

        // Unidades más perdidas
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

        // Unidades con más bajas
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

        // Artículos más solicitados
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

        // Artículos más perdidos
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

        // Artículos más dados de baja
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

        // Renderizar la vista con los datos obtenidos de las consultas
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
        // En caso de error, registrar el error y devolver respuesta 500
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/dashboard/home",
                codigo_http: 500
            },
        })
        return res.status(500).json({ message: "Internal server error" });
    }
}


module.exports = {
    renderHome,
};
