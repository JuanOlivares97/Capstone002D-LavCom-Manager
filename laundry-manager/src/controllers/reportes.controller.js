const prisma = require("../server/prisma");
const tempo = require("@formkit/tempo");

// FUNCIÓN PARA RENDERIZAR LA PÁGINA PRINCIPAL (HOME)
async function renderHome(req, res) {
    try {
        // Obtener el tipo de usuario desde la solicitud
        const tipo_user = req.user["tipo_usuario"];
        const unidades = await prisma.unidad_sigcom.findMany();

        // Renderiza la vista 'reports/home' y pasa el tipo de usuario convertido a entero
        return res.status(200).render('reports/home', {tipo_usuario: parseInt(tipo_user), unidades});
        
    } catch (error) {
        // Si ocurre un error, se guarda en el registro de errores de la base de datos
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si hay un usuario, se guarda su ID, si no, null
                tipo_error: "Error interno del servidor", // Descripción del tipo de error
                mensaje_error: JSON.stringify(error), // El error en detalle para depuración
                ruta_error: "laundry-manager/reports/home", // Ruta donde ocurrió el error
                codigo_http: 500, // Código HTTP correspondiente al error
            }
        })
        
        // Responde con un error 500 al cliente si algo sale mal
        return res.status(500).json({ message: "Internal server error" });
    }
}

// FUNCIÓN PARA OBTENER REPORTE COMPLETO
async function getFullReport(req, res) {
    try {
        // Llamar a un procedimiento almacenado en la base de datos
        const result = await prisma.$queryRaw`CALL ropa_disponible_hospital();`;

        // Formatear el resultado para mapear correctamente los nombres de las columnas
        const formattedResult = result.map(row => ({
            id_articulo: row.f0, // El primer valor de la fila corresponde al 'id_articulo'
            nombre_articulo: row.f1, // El segundo valor es el 'nombre_articulo'
            roperia_limpio: row.f2, // El tercer valor es 'roperia_limpio'
            ropa_servicios: row.f3, // El cuarto valor es 'ropa_servicios'
            roperia_sucio: row.f4, // El quinto valor es 'roperia_sucio'
            en_lavanderia: row.f5, // El sexto valor es 'en_lavanderia'
            perdidas_totales: row.f6, // El séptimo valor es 'perdidas_totales'
            bajas_totales: row.f7 // El octavo valor es 'bajas_totales'
        }));

        // Retornar el resultado formateado con un estado 200
        return res.status(200).json(formattedResult);
    } catch (error) {
        // Si ocurre un error, se guarda en el registro de errores de la base de datos
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si hay un usuario, se guarda su ID, si no, null
                tipo_error: "Error interno del servidor", // Descripción del tipo de error
                mensaje_error: JSON.stringify(error), // El error en detalle para depuración
                ruta_error: "laundry-manager/reports/get-report", // Ruta donde ocurrió el error
                codigo_http: 500, // Código HTTP correspondiente al error
            }
        })
        
        // Responde con un error 500 al cliente si algo sale mal
        return res.status(500).json({ message: "Internal server error" });
    }
}

// FUNCIÓN PARA OBTENER REPORTE DE SERVICIOS
async function getServicesReport(req, res) {
    try {
        // Llamar a un procedimiento almacenado en la base de datos
        const result = await prisma.$queryRaw`CALL get_services_report();`;

        // Formatear el resultado para mapear correctamente los nombres de las columnas
        const formattedResult = result.map(row => ({
            id_articulo: row.f0, // El primer valor de la fila corresponde al 'id_articulo'
            nombre_articulo: row.f1, // El segundo valor es el 'nombre_articulo'
            unidad_sigcom: row.f2, // El tercer valor es 'unidad_sigcom'
            ropa_servicios: row.f3, // El cuarto valor es 'ropa_servicios'
        }));

        // Retornar el resultado formateado con un estado 200
        return res.status(200).json(formattedResult);
    } catch (error) {
        // Si ocurre un error, se guarda en el registro de errores de la base de datos
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si hay un usuario, se guarda su ID, si no, null
                tipo_error: "Error interno del servidor", // Descripción del tipo de error
                mensaje_error: JSON.stringify(error), // El error en detalle para depuración
                ruta_error: "laundry-manager/reports/get-services-report", // Ruta donde ocurrió el error
                codigo_http: 500, // Código HTTP correspondiente al error
            }
        })
        
        // Responde con un error 500 al cliente si algo sale mal
        return res.status(500).json({ message: "Internal server error" });
    }
}

// FUNCIÓN PARA OBTENER REPORTE DE BAJAS Y PERDIDAS
async function getBajasyPerdidas(req, res) {
    try {
        // Llamar a un procedimiento almacenado en la base de datos que obtiene las bajas y pérdidas
        const result = await prisma.$queryRaw`CALL bajas_perdidas();`;

        // Formatear el resultado para mapear correctamente las columnas
        const formattedResult = result.map(row => ({
            id_articulo: row.f0, // El primer valor corresponde al 'id_articulo'
            nombre_articulo: row.f1, // El segundo valor es el 'nombre_articulo'
            perdidas_externas: row.f2, // El tercer valor es 'perdidas_externas'
            perdidas_internas: row.f3, // El cuarto valor es 'perdidas_internas'
            perdidas_totales: row.f4, // El quinto valor es 'perdidas_totales'
            bajas_servicio: row.f5, // El sexto valor es 'bajas_servicio'
            bajas_roperia: row.f6, // El séptimo valor es 'bajas_roperia'
            bajas_totales: row.f7 // El octavo valor es 'bajas_totales'
        }));

        // Retornar los resultados formateados con un código de estado 200
        return res.status(200).json(formattedResult);
    } catch (error) {
        // En caso de error, registrar el error en la base de datos
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, se guarda su ID
                tipo_error: "Error interno del servidor", // Descripción del tipo de error
                mensaje_error: JSON.stringify(error), // El mensaje de error en formato JSON
                ruta_error: "laundry-manager/reports/get-bajas-perdidas", // Ruta del error
                codigo_http: 500, // Código de estado HTTP para un error interno
            }
        })
        
        // Retornar un error 500 al cliente indicando un error interno del servidor
        return res.status(500).json({ message: "Internal server error" });
    }
}

// FUNCIÓN PARA OBTENER REPORTE DE BAJAS DE SERVICIOS
async function getServicesDownReport(req, res) {
    try {
        // Obtener la fecha actual
        const fecha = new Date();
        const anio = fecha.getFullYear(); // Año actual
        const mes = fecha.getMonth() + 1; // Mes actual (sumamos 1 porque getMonth() devuelve el mes desde 0)

        // Llamar a un procedimiento almacenado en la base de datos, pasando mes y año como parámetros
        const result = await prisma.$queryRaw`
            CALL obtener_ropa_baja_servicios(${mes}, ${anio});
        `;

        // Formatear el resultado para mapear correctamente las columnas
        const formattedResult = result.map(row => ({
            mes_anio: row.f0, // El primer valor corresponde a 'mes_anio'
            id_articulo: row.f1, // El segundo valor es el 'id_articulo'
            nombre_articulo: row.f2, // El tercer valor es 'nombre_articulo'
            unidad_sigcom: row.f3, // El cuarto valor es 'unidad_sigcom'
            ropa_baja_servicios: row.f4 // El quinto valor es 'ropa_baja_servicios'
        }));

        // Retornar los resultados formateados con un código de estado 200
        return res.status(200).json(formattedResult);
    } catch (error) {
        // En caso de error, registrar el error en la base de datos
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, se guarda su ID
                tipo_error: "Error interno del servidor", // Descripción del tipo de error
                mensaje_error: JSON.stringify(error), // El mensaje de error en formato JSON
                ruta_error: "laundry-manager/reports/get-bajas-services", // Ruta del error
                codigo_http: 500, // Código de estado HTTP para un error interno
            }
        })
        
        // Retornar un error 500 al cliente indicando un error interno del servidor
        return res.status(500).json({ message: "Internal server error" });
    }
}

// FUNCIÓN PARA OBTENER REPORTE DE REGISTROS
async function getRegistros(req, res) {
    try {
        // Buscar registros en la base de datos, incluyendo varios detalles relacionados
        const registros = await prisma.registro.findMany({
            include: {
                // Incluir detalles del registro, y dentro de cada detalle, los artículos relacionados
                detalle_registro: {
                    include: {
                        articulo: true
                    }
                },
                tipo_registro: true, // Incluir el tipo de registro relacionado
                usuarios_registro_rut_usuario_1Tousuarios: {
                    select: {
                        nombre: true // Incluir el nombre del primer usuario asociado al registro
                    }
                },
                usuarios_registro_rut_usuario_2Tousuarios: {
                    select: {
                        nombre: true // Incluir el nombre del segundo usuario asociado al registro
                    }
                },
                unidad_sigcom: true // Incluir la unidad de sigcom relacionada
            },
            orderBy: {
                id_registro: "desc" // Ordenar los registros por ID de manera descendente
            }
        });

        // Si no se encuentran registros, registrar el error en el log de la base de datos
        if (!registros) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                    tipo_error: "Error de base de datos", // Tipo de error
                    mensaje_error: "Error obteniendo registros", // Descripción del error
                    ruta_error: "laundry-manager/reports/get-records", // Ruta donde ocurrió el error
                    codigo_http: 400, // Código HTTP correspondiente a un error de solicitud
                }
            });
            // Retornar un error 400 indicando que no se pudieron obtener los registros
            return res.status(400).json({ message: "Error obteniendo registros", success: false });
        }

        // Retornar los registros con un mensaje de éxito y un código HTTP 200
        return res.status(200).json({ message: "Registros obtenidos exitosamente", success: true, registros });
    } catch (error) {
        // Si ocurre un error en el proceso, registrar el error en el log de la base de datos
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                tipo_error: "Error interno del servidor", // Tipo de error
                mensaje_error: JSON.stringify(error), // Descripción detallada del error en formato JSON
                ruta_error: "laundry-manager/reports/get-records", // Ruta donde ocurrió el error
                codigo_http: 500, // Código HTTP correspondiente a un error interno
            }
        });
        // Retornar un error 500 indicando un error interno del servidor
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function generalReportDate(req, res) {
    try {
        const mes = parseInt(req.params.mes);
        const anio = parseInt(req.params.anio);
        const tipo = parseInt(req.params.tipo);

        const result = await prisma.$queryRaw`
            SELECT 
                a.nombre_articulo,
                COALESCE(SUM(
                    CASE WHEN r.id_tipo_registro = ${tipo} 
                        AND MONTH(r.fecha) = ${mes} 
                        AND YEAR(r.fecha) = ${anio} 
                    THEN dr.cantidad 
                    ELSE NULL END
                ), 0) as cantidad_total
            FROM articulo a
            LEFT JOIN detalle_registro dr ON a.id_articulo = dr.id_articulo
            LEFT JOIN registro r ON r.id_registro = dr.id_registro
            GROUP BY a.id_articulo, a.nombre_articulo
            ORDER BY a.id_articulo;
        `;

        const name_tipo = await prisma.tipo_registro.findUnique({
            where: {
                id_tipo_registro: parseInt(tipo)
            },
            select: {
                tipo_registro: true
            }
        })

        return res.status(200).json({ success: true, file: `${name_tipo["tipo_registro"].toLowerCase()} ${mes}_${anio}.xlsx`,result });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                tipo_error: "Error interno del servidor", // Tipo de error
                mensaje_error: JSON.stringify(error), // Descripción detallada del error en formato JSON
                ruta_error: "laundry-manager/reports/get-general-date", // Ruta donde ocurrió el error
                codigo_http: 500, // Código HTTP correspondiente a un error interno
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function getBajasyPerdidasDate(req, res) {
    try {
        const mes = parseInt(req.params.mes);
        const anio = parseInt(req.params.anio);
        const result = await prisma.$queryRaw`
            SELECT  
                a.id_articulo,
                a.nombre_articulo,
                COALESCE(registros.perdida_ex, 0) as perdidas_externas,
                COALESCE(registros.perdida_int, 0) as perdidas_internas,
                COALESCE(registros.perdida_ex, 0) + COALESCE(registros.perdida_int, 0) as perdidas_totales,
                COALESCE(registros.bajas_serv, 0) as bajas_servicio,
                COALESCE(registros.bajas_roperia, 0) as bajas_roperia,
                COALESCE(registros.bajas_serv, 0) + COALESCE(registros.bajas_roperia, 0) as bajas_totales
            FROM articulo a
            LEFT JOIN (
                SELECT
                    dr.id_articulo,
                    SUM(CASE WHEN r.id_tipo_registro = 5 THEN dr.cantidad ELSE 0 END) as perdida_ex,
                    SUM(CASE WHEN r.id_tipo_registro = 6 THEN dr.cantidad ELSE 0 END) as perdida_int,
                    SUM(CASE WHEN r.id_tipo_registro = 7 THEN dr.cantidad ELSE 0 END) as bajas_serv,
                    SUM(CASE WHEN r.id_tipo_registro = 8 THEN dr.cantidad ELSE 0 END) as bajas_roperia
                FROM detalle_registro dr
                INNER JOIN registro r on r.id_registro = dr.id_registro
                WHERE YEAR(r.fecha) = ${anio} AND MONTH(r.fecha) = ${mes}
                GROUP BY dr.id_articulo
            ) as registros ON a.id_articulo = registros.id_articulo 
            ORDER BY a.id_articulo;
        `;
        return res.status(200).json({ success: true, file: `bajas y perdidas ${mes}_${anio}.xlsx`,result });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                tipo_error: "Error interno del servidor", // Tipo de error
                mensaje_error: JSON.stringify(error), // Descripción detallada del error en formato JSON
                ruta_error: "laundry-manager/reports/get-bajasyperdidas-date", // Ruta donde ocur：rrio el error
                codigo_http: 500, // Código HTTP correspondiente a un error interno
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function generalReportDateUsigcom(req, res) {
    try {
        const mes = parseInt(req.params.mes);
        const anio = parseInt(req.params.anio);
        const tipo = parseInt(req.params.tipo);
        const usigcom = parseInt(req.params.usigcom);

        const result = await prisma.$queryRaw`
            SELECT 
                a.nombre_articulo,
                COALESCE(SUM(
                    CASE WHEN r.id_tipo_registro = ${tipo} 
                        AND MONTH(r.fecha) = ${mes} 
                        AND YEAR(r.fecha) = ${anio} 
                        AND r.id_unidad_sigcom = ${usigcom}
                    THEN dr.cantidad 
                    ELSE NULL END
                ), 0) as cantidad_total
            FROM articulo a
            LEFT JOIN detalle_registro dr ON a.id_articulo = dr.id_articulo
            LEFT JOIN registro r ON r.id_registro = dr.id_registro
            GROUP BY a.id_articulo, a.nombre_articulo
            ORDER BY a.id_articulo;
        `;

        const name_tipo = await prisma.tipo_registro.findUnique({
            where: {
                id_tipo_registro: parseInt(tipo)
            },
            select: {
                tipo_registro: true
            }
        })

        const unidad = await prisma.unidad_sigcom.findUnique({
            where: {
                id_unidad_sigcom: parseInt(usigcom)
            },
            select: {
                unidad_sigcom: true
            }
        })

        return res.status(200).json({ success: true, file: `${name_tipo["tipo_registro"].toLowerCase()} ${unidad["unidad_sigcom"]} ${mes}_${anio}.xlsx`,result });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                tipo_error: "Error interno del servidor", // Tipo de error
                mensaje_error: JSON.stringify(error), // Descripción detallada del error en formato JSON
                ruta_error: "laundry-manager/reports/get-general-date-usigcom", // Ruta donde ocurrió el error
                codigo_http: 500, // Código HTTP correspondiente a un error interno
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function getBajasyPerdidasDateUsigcom(req, res) {
    try {
        const mes = parseInt(req.params.mes);
        const anio = parseInt(req.params.anio);
        const usigcom = parseInt(req.params.usigcom);

        const result = await prisma.$queryRaw`
            SELECT  
                a.id_articulo,
                a.nombre_articulo,
                COALESCE(registros.perdida_int, 0) as perdidas_internas,
                COALESCE(registros.bajas_serv, 0) as bajas_servicio
            FROM articulo a
            LEFT JOIN (
                SELECT
                    dr.id_articulo,
                    SUM(CASE WHEN r.id_tipo_registro = 6 THEN dr.cantidad ELSE 0 END) as perdida_int,
                    SUM(CASE WHEN r.id_tipo_registro = 7 THEN dr.cantidad ELSE 0 END) as bajas_serv
                FROM detalle_registro dr
                INNER JOIN registro r on r.id_registro = dr.id_registro
                WHERE YEAR(r.fecha) = ${anio} 
                AND MONTH(r.fecha) = ${mes}
                AND r.id_unidad_sigcom = ${usigcom}
                GROUP BY dr.id_articulo
            ) as registros ON a.id_articulo = registros.id_articulo 
            ORDER BY a.id_articulo;
        `;

        const unidad = await prisma.unidad_sigcom.findUnique({
            where: {
                id_unidad_sigcom: parseInt(usigcom)
            },
            select: {
                unidad_sigcom: true
            }
        })    

        return res.status(200).json({ success: true, file: `bajas y perdidas ${mes}_${anio} ${unidad["unidad_sigcom"]}.xlsx`,result });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                tipo_error: "Error interno del servidor", // Tipo de error
                mensaje_error: JSON.stringify(error), // Descripción detallada del error en formato JSON
                ruta_error: "laundry-manager/reports/get-bajasyperdidas-date", // Ruta donde ocur：rrio el error
                codigo_http: 500, // Código HTTP correspondiente a un error interno
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function getDailyReport(req, res) {
    try {
        const fecha_raw = req.params.fecha;
        const fecha_format = tempo.format(fecha_raw, "YYYY-MM-DD", "cl");
        const fecha = new Date(fecha_format);

        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const dia = fecha.getDate() + 1;
        const tipo = parseInt(req.params.tipo);

        const result = await prisma.$queryRaw`
            SELECT 
            a.nombre_articulo,
                COALESCE(SUM(
                    CASE WHEN r.id_tipo_registro = ${tipo}
                        AND DAY(r.fecha) = ${dia}
                        AND MONTH(r.fecha) = ${mes}
                        AND YEAR(r.fecha) = ${anio}
                    THEN dr.cantidad 
                    ELSE NULL END
                ), 0) as cantidad_total
            FROM articulo a
            LEFT JOIN detalle_registro dr ON a.id_articulo = dr.id_articulo
            LEFT JOIN registro r ON r.id_registro = dr.id_registro
            GROUP BY a.id_articulo, a.nombre_articulo
            ORDER BY a.id_articulo;
        `;

        const tipo_registro = await prisma.tipo_registro.findUnique({
            where: {
                id_tipo_registro: parseInt(tipo)
            },
            select: {
                tipo_registro: true
            }
        })

        return res.status(200).json({ success: true, result, file: `${tipo_registro["tipo_registro"].toLowerCase()} ${dia}_${mes}_${anio}.xlsx` });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                tipo_error: "Error interno del servidor", // Tipo de error
                mensaje_error: JSON.stringify(error), // Descripción detallada del error en formato JSON
                ruta_error: "laundry-manager/reports/get-daily-report", // Ruta donde ocurrió el error
                codigo_http: 500, // Código HTTP correspondiente a un error interno
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function getDailyBp(req, res) {
    try {
        const fecha_raw = req.params.fecha;
        const fecha_format = tempo.format(fecha_raw, "YYYY-MM-DD", "cl");
        const fecha = new Date(fecha_format);

        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const dia = fecha.getDate() + 1;

        const result = await prisma.$queryRaw`
            SELECT  
                a.id_articulo,
                a.nombre_articulo,
                COALESCE(registros.perdida_ex, 0) as perdidas_externas,
                COALESCE(registros.perdida_int, 0) as perdidas_internas,
                COALESCE(registros.perdida_ex, 0) + COALESCE(registros.perdida_int, 0) as perdidas_totales,
                COALESCE(registros.bajas_serv, 0) as bajas_servicio,
                COALESCE(registros.bajas_roperia, 0) as bajas_roperia,
                COALESCE(registros.bajas_serv, 0) + COALESCE(registros.bajas_roperia, 0) as bajas_totales
            FROM articulo a
            LEFT JOIN (
                SELECT
                    dr.id_articulo,
                    SUM(CASE WHEN r.id_tipo_registro = 5 THEN dr.cantidad ELSE 0 END) as perdida_ex,
                    SUM(CASE WHEN r.id_tipo_registro = 6 THEN dr.cantidad ELSE 0 END) as perdida_int,
                    SUM(CASE WHEN r.id_tipo_registro = 7 THEN dr.cantidad ELSE 0 END) as bajas_serv,
                    SUM(CASE WHEN r.id_tipo_registro = 8 THEN dr.cantidad ELSE 0 END) as bajas_roperia
                FROM detalle_registro dr
                INNER JOIN registro r on r.id_registro = dr.id_registro
                WHERE YEAR(r.fecha) = ${anio} AND MONTH(r.fecha) = ${mes} AND DAY(r.fecha) = ${dia}
                GROUP BY dr.id_articulo
            ) as registros ON a.id_articulo = registros.id_articulo 
            ORDER BY a.id_articulo;
        `;

        return res.status(200).json({ success: true, file: `bajas y perdidas ${dia}_${mes}_${anio}.xlsx`,result });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                tipo_error: "Error interno del servidor", // Tipo de error
                mensaje_error: JSON.stringify(error), // Descripción detallada del error en formato JSON
                ruta_error: "laundry-manager/reports/get-daily-bp", // Ruta donde ocurrido el error
                codigo_http: 500, // Código HTTP correspondiente a un error interno
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function getDailyReportUsigcom(req, res) {
    try {
        const fecha_raw = req.params.fecha;
        const fecha_format = tempo.format(fecha_raw, "YYYY-MM-DD", "cl");
        const fecha = new Date(fecha_format);

        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const dia = fecha.getDate() + 1;
        const tipo = parseInt(req.params.tipo);

        const usigcom = parseInt(req.params.usigcom);

        const result = await prisma.$queryRaw`
            SELECT 
            a.nombre_articulo,
                COALESCE(SUM(
                    CASE WHEN r.id_tipo_registro = ${tipo}
                        AND DAY(r.fecha) = ${dia}
                        AND MONTH(r.fecha) = ${mes}
                        AND YEAR(r.fecha) = ${anio}
                        AND r.id_unidad_sigcom = ${usigcom}
                    THEN dr.cantidad 
                    ELSE NULL END
                ), 0) as cantidad_total
            FROM articulo a
            LEFT JOIN detalle_registro dr ON a.id_articulo = dr.id_articulo
            LEFT JOIN registro r ON r.id_registro = dr.id_registro
            GROUP BY a.id_articulo, a.nombre_articulo
            ORDER BY a.id_articulo;
        `;

        const tipo_registro = await prisma.tipo_registro.findUnique({
            where: {
                id_tipo_registro: parseInt(tipo)
            },
            select: {
                tipo_registro: true
            }
        })

        const unidad_sigcom = await prisma.unidad_sigcom.findUnique({
            where: {
                id_unidad_sigcom: parseInt(usigcom)
            },
            select: {
                unidad_sigcom: true
            }
        })

        return res.status(200).json({ success: true, result, file: `${tipo_registro["tipo_registro"].toLowerCase()} ${unidad_sigcom["unidad_sigcom"]} ${dia}_${mes}_${anio}.xlsx` });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                tipo_error: "Error interno del servidor", // Tipo de error
                mensaje_error: JSON.stringify(error), // Descripción detallada del error en formato JSON
                ruta_error: "laundry-manager/reports/get-daily-report", // Ruta donde ocurrió el error
                codigo_http: 500, // Código HTTP correspondiente a un error interno
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function getDailyBpUsigcom(req, res) {
    try {
        const fecha_raw = req.params.fecha;
        const fecha_format = tempo.format(fecha_raw, "YYYY-MM-DD", "cl");
        const fecha = new Date(fecha_format);

        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
        const dia = fecha.getDate() + 1;
        const usigcom = parseInt(req.params.usigcom);

        const result = await prisma.$queryRaw`
            SELECT  
                a.id_articulo,
                a.nombre_articulo,
                COALESCE(registros.perdida_int, 0) as perdidas_internas,
                COALESCE(registros.bajas_serv, 0) as bajas_servicio
            FROM articulo a
            LEFT JOIN (
                SELECT
                    dr.id_articulo,
                    SUM(CASE WHEN r.id_tipo_registro = 6 THEN dr.cantidad ELSE 0 END) as perdida_int,
                    SUM(CASE WHEN r.id_tipo_registro = 7 THEN dr.cantidad ELSE 0 END) as bajas_serv
                FROM detalle_registro dr
                INNER JOIN registro r on r.id_registro = dr.id_registro
                WHERE YEAR(r.fecha) = ${anio} AND MONTH(r.fecha) = ${mes} AND DAY(r.fecha) = ${dia} AND r.id_unidad_sigcom = ${usigcom}
                GROUP BY dr.id_articulo
            ) as registros ON a.id_articulo = registros.id_articulo 
            ORDER BY a.id_articulo;
        `;

        const unidad = await prisma.unidad_sigcom.findUnique({
            where: {
                id_unidad_sigcom: usigcom
            },
            select: {
                unidad_sigcom: true
            }
        })

        return res.status(200).json({ success: true, file: `bajas y perdidas ${unidad["unidad_sigcom"].toLowerCase()} ${dia}_${mes}_${anio}.xlsx`,result });
    } catch (error) {
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null, // Si existe un usuario, guardamos su ID
                tipo_error: "Error interno del servidor", // Tipo de error
                mensaje_error: JSON.stringify(error), // Descripción detallada del error en formato JSON
                ruta_error: "laundry-manager/reports/get-daily-bp", // Ruta donde ocurrido el error
                codigo_http: 500, // Código HTTP correspondiente a un error interno
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// EXPORTAR FUNCIONES
module.exports = {
    renderHome,
    getFullReport,
    getServicesReport,
    getBajasyPerdidas,
    getServicesDownReport,
    getRegistros,
    generalReportDate,
    getBajasyPerdidasDate,
    generalReportDateUsigcom,
    getBajasyPerdidasDateUsigcom,
    getDailyReport,
    getDailyBp,
    getDailyReportUsigcom,
    getDailyBpUsigcom
};