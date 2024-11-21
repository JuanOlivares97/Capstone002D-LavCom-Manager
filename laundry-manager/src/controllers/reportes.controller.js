const prisma = require("../server/prisma");

// FUNCIÓN PARA RENDERIZAR LA PÁGINA PRINCIPAL (HOME)
async function renderHome(req, res) {
    try {
        // Obtener el tipo de usuario desde la solicitud
        const tipo_user = req.user["tipo_usuario"];

        // Renderiza la vista 'reports/home' y pasa el tipo de usuario convertido a entero
        return res.status(200).render('reports/home', {tipo_usuario: parseInt(tipo_user)});
        
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
        res.status(500).json({ message: "Internal server error", success: false, error });
    }
}

// EXPORTAR FUNCIONES
module.exports = {
    renderHome,
    getFullReport,
    getServicesReport,
    getBajasyPerdidas,
    getServicesDownReport,
    getRegistros
};