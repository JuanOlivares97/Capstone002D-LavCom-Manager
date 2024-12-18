const prisma = require("../server/prisma");
const tempo = require("@formkit/tempo");

// FUNCIÓN PARA RENDERIZAR LA PÁGINA PRINCIPAL
async function renderHome(req, res) {
    try {
        // Obtiene datos del usuario logueado desde la solicitud.
        const rutLogueado = req.user["rutLogueado"];
        const nombreLogueado = req.user["nombreLogueado"];

        // Busca todos los usuarios que no estén marcados como borrados en la base de datos.
        const usuarios = await prisma.usuarios.findMany({
            where: {
                borrado: false,
            },
        });

        // Obtiene todas las unidades de la base de datos.
        const unidades_sigcom = await prisma.unidad_sigcom.findMany();

        // Recupera el tipo de usuario del usuario logueado para personalizar la vista.
        const tipo_user = req.user["tipo_usuario"];

        // Renderiza la página 'clothes/home' con los datos obtenidos y la información del usuario logueado.
        res.status(200).render("clothes/home", { 
            usuarios, 
            unidades_sigcom, 
            tipo_usuario: tipo_user, 
            rutLogueado, 
            nombreLogueado 
        });
    } catch (error) {
        // En caso de error, registra la información detallada en el log de errores y retorna un código 500.
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/home",
                codigo_http: 500,
            }
        });

        // Devuelve un mensaje de error al cliente con un estado 500.
        return res.status(500).json({ message: "Internal server error" });
    }
}

// FUNCIÓN PARA OBTENER ARTÍCULOS
async function getArticulos(req, res) {
    try {
        // Busca todos los artículos no borrados en la base de datos.
        const articulos = await prisma.articulo.findMany({
            where: {
                borrado: false,
            },
        });
        
        // Para cada artículo, obtiene su subgrupo correspondiente y lo añade al resultado.
        const articulosConSubgrupo = await Promise.all(
            articulos.map(async (articulo) => {
                const subgrupo = await prisma.subgrupo_ropa.findUnique({
                    where: {
                        id_subgrupo_ropa: articulo.id_subgrupo_ropa,
                    },
                });
                return { ...articulo, subgrupo: subgrupo.desc_subgrupo };
            })
        );
        
        // Devuelve una respuesta con el listado de artículos incluyendo sus subgrupos.
        return res.status(200).json(articulosConSubgrupo);
    } catch (error) {
        // En caso de error, registra la información en el log y envía una respuesta con estado 500.
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/get-clothes",
                codigo_http: 500,
            }
        });

        // Envía un mensaje de error al cliente con un estado 500.
        return res.status(500).json({ message: "Internal server error" });
    }
}

// FUNCIÓN  PARA CREAR UN ARTÍCULO
async function createArticulo(req, res) {
    try {
        // Verifica si ya existe un artículo con el mismo nombre en la base de datos.
        const existingArticulo = await prisma.articulo.findUnique({
            where: {
                nombre_articulo: req.body.nombre,
            },
        });

        // Si el artículo ya existe, registra el error y devuelve un estado 400.
        if (existingArticulo) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error en ingreso de datos",
                    mensaje_error: "El artículo que se intentó ingresar ya existe",
                    ruta_error: "laundry-manager/clothes/create-clothes",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ 
                message: "El artículo ya existe, es posible que este se encuentre deshabilitado, contacte al administrador", 
                success: false 
            });
        }

        // Verifica si el stock ingresado es un número entero positivo.
        const stock = parseInt(req.body.stock);
        if (isNaN(stock) || stock <= 0) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error en ingreso de datos",
                    mensaje_error: "El stock que se intentó ingresar es inválido",
                    ruta_error: "laundry-manager/clothes/create-clothes",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ 
                message: "Stock debe ser un número entero positivo", 
                success: false 
            });
        }

        // Crea un nuevo objeto artículo con los datos proporcionados.
        const newArticulo = {
            nombre_articulo: req.body.nombre,
            stock: stock,
            id_subgrupo_ropa: parseInt(req.body.subgrupo),
            borrado: false,
        };

        // Intenta crear el artículo en la base de datos, incluyendo información del subgrupo.
        const articulo = await prisma.articulo.create({
            data: newArticulo,
            include: {
                subgrupo_ropa: true,
            }
        });

        // Si la creación falla por algún motivo, registra el error y devuelve un estado 400.
        if (!articulo) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de base de datos",
                    mensaje_error: "No se pudo crear el artículo deseado",
                    ruta_error: "laundry-manager/clothes/create-clothes",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ 
                message: "Error al crear artículo", 
                success: false 
            });
        }

        // Devuelve una respuesta exitosa con el artículo recién creado.
        return res.status(200).json({ 
            message: "Artículo creado exitosamente", 
            success: true, 
            articulo 
        });
    } catch (error) {
        // En caso de error, registra el detalle del fallo en la base de datos y envía una respuesta con estado 500.
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/create-clothes",
                codigo_http: 500
            }
        });

        // Envía un mensaje de error al cliente con un estado 500.
        return res.status(500).json({ 
            message: "Internal server error", 
            success: false 
        });
    }
}

// FUNCIÓN PARA ACTUALIZAR UN ARTÍCULO
async function updateArticulo(req, res) {
    try {
        // Verifica que el stock proporcionado sea un número entero positivo.
        const stock = parseInt(req.body.stock);
        if (isNaN(stock) || stock <= 0) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error en ingreso de datos",
                    mensaje_error: "El stock que se intentó ingresar es inválido",
                    ruta_error: "laundry-manager/clothes/update-clothes",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ 
                message: "Stock debe ser un número entero positivo", 
                success: false 
            });
        }

        // Verifica si ya existe otro artículo con el mismo nombre pero diferente ID.
        const existingArticulo = await prisma.articulo.findFirst({
            where: {
                nombre_articulo: req.body.nombre,
                id_articulo: {
                    not: parseInt(req.body.id_articulo), // Evita coincidir con el ID del artículo que se está actualizando.
                },
            },
        });

        // Si el artículo ya existe, registra el error y devuelve un estado 400.
        if (existingArticulo) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error en ingreso de datos",
                    mensaje_error: "El artículo que se intentó ingresar ya existe",
                    ruta_error: "laundry-manager/clothes/update-clothes",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ 
                message: "El artículo ya existe, es posible que este se encuentre deshabilitado, contacte al administrador", 
                success: false 
            });
        }

        // Define el objeto artículo con los nuevos datos proporcionados.
        const articulo = {
            nombre_articulo: req.body.nombre,
            stock: stock,
            id_subgrupo_ropa: parseInt(req.body.subgrupo),
            borrado: false,
        };

        // Intenta actualizar el artículo en la base de datos, incluyendo información del subgrupo.
        const articulo_actualizado = await prisma.articulo.update({
            where: {
                id_articulo: parseInt(req.body.id_articulo),
            },
            data: articulo,
            include: {
                subgrupo_ropa: true,
            }
        });

        // Si la actualización falla, registra el error y devuelve un estado 400.
        if (!articulo_actualizado) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de base de datos",
                    mensaje_error: "No se pudo actualizar el artículo deseado",
                    ruta_error: "laundry-manager/clothes/update-clothes",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ 
                message: "Error al actualizar artículo", 
                success: false 
            });
        }

        // Devuelve una respuesta exitosa con el artículo actualizado.
        return res.status(200).json({ 
            message: "Artículo actualizado exitosamente", 
            success: true, 
            articulo_actualizado 
        });
    } catch (error) {
        // En caso de error, registra el detalle del fallo en la base de datos y envía una respuesta con estado 500.
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/update-clothes",
                codigo_http: 500
            }
        });

        // Envía un mensaje de error al cliente con un estado 500.
        return res.status(500).json({ 
            message: "Internal server error", 
            success: false 
        });
    }
}

// FUNCIÓN ASÍNCRONA PARA "ELIMINAR" UN ARTÍCULO
async function deleteArticulo(req, res) {
    try {
        // Intenta marcar un artículo como "borrado" en la base de datos utilizando su ID.
        const articulo = await prisma.articulo.update({
            where: {
                id_articulo: parseInt(req.body.id_articulo),
            },
            data: {
                borrado: true,
            },
        });

        // Si la operación falla, registra el error y devuelve un estado 400.
        if (!articulo) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de base de datos",
                    mensaje_error: "No se pudo eliminar el artículo deseado",
                    ruta_error: "laundry-manager/clothes/delete-clothes",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ 
                message: "Error al eliminar artículo", 
                success: false 
            });
        }

        // Devuelve una respuesta exitosa si el artículo se eliminó correctamente.
        return res.status(200).json({ 
            message: "Artículo eliminado exitosamente", 
            success: true 
        });
    } catch (error) {
        // En caso de error, registra el detalle del fallo en la base de datos y envía una respuesta con estado 500.
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/delete-clothes",
                codigo_http: 500
            }
        });

        // Envía un mensaje de error al cliente con un estado 500.
        return res.status(500).json({ 
            message: "Internal server error", 
            success: false 
        });
    }
}

// FUNCIÓN PARA ENTREGAR ROPA LIMPIA A UNA UNIDAD EN SIGCOM
async function entregarUnidadSigcom(req, res) {
    try {
        // Formatear la fecha actual en el formato requerido para Chile.
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");
        const data = req.body;
        const rut_usuario_1 = req.user["rutLogueado"];

        // Validar que la cantidad de cada artículo en la solicitud sea válida.
        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);
            if (isNaN(cantidad) || cantidad <= 0) {
                await prisma.error_log.create({
                    data: {
                        id_usuario: req.user["id_usuario"] || null,
                        tipo_error: "Error en ingreso de datos",
                        mensaje_error: "Se intentó ingresar una cantidad de artículos no válida",
                        ruta_error: "laundry-manager/clothes/entregar-unidad-sigcom",
                        codigo_http: 400
                    }
                });
                return res.status(400).json({ 
                    message: `La cantidad de cada artículo debe ser un número entero positivo. Error en artículo en la posición ${i + 1}`, 
                    success: false 
                });
            }
        }

        // Crear un nuevo registro en la base de datos con la información proporcionada.
        const result = await prisma.registro.create({
            data: {
                rut_usuario_1: parseInt(rut_usuario_1),
                rut_usuario_2: parseInt(data.rut_usuario_2),
                id_unidad_sigcom: parseInt(data.id_unidad_sigcom),
                id_tipo_registro: 1,
                detalle_registro: {
                    create: data.articulos.map(a => {
                        return {
                            cantidad: parseInt(a.cantidad),
                            id_articulo: parseInt(a.id_articulo),
                        };
                    })
                },
                cantidad_total: data.articulos.reduce((acc, a) => acc + parseInt(a.cantidad), 0),
                fecha: fecha,
            },
        });

        // Verificar si el registro fue creado correctamente.
        if (!result) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de base de datos",
                    mensaje_error: "No se pudo crear el registro",
                    ruta_error: "laundry-manager/clothes/entregar-unidad-sigcom",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ 
                message: "Error creando registro", 
                success: false 
            });
        }

        // Si todo es exitoso, enviar una respuesta indicando el éxito.
        return res.status(200).json({ 
            message: "Registro creado exitosamente", 
            success: true 
        });
    } catch (error) {
        // Manejar errores internos del servidor y registrar el detalle en la base de datos.
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/entregar-unidad-sigcom",
                codigo_http: 500
            }
        });

        // Enviar una respuesta de error interno del servidor.
        return res.status(500).json({ 
            message: "Internal server error", 
            success: false 
        });
    }
}

// FUNCIÓN PARA DAR ROPA DE BAJA
async function darRopaDeBaja(req, res) {
    try {
        // Formatear la fecha actual en el formato requerido para Chile.
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");
        let data = req.body;
        const rut_usuario_1 = req.user["rutLogueado"];

        // Si el tipo de baja es "8", el campo id_unidad_sigcom se establece en null.
        if (data.tipo_dada_de_baja === "8") {
            data.id_unidad_sigcom = null;
        }

        // Validación de cantidad y stock de cada artículo antes de proceder.
        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);

            // Verificar que la cantidad de artículos sea válida.
            if (isNaN(cantidad) || cantidad <= 0) {
                await prisma.error_log.create({
                    data: {
                        id_usuario: req.user["id_usuario"] || null,
                        tipo_error: "Error en ingreso de datos",
                        mensaje_error: "Se intentó ingresar una cantidad de artículos no válida",
                        ruta_error: "laundry-manager/clothes/dar-ropa-de-baja",
                        codigo_http: 400
                    }
                });
                return res.status(400).json({ 
                    message: `La cantidad de cada artículo debe ser un número entero positivo. Error en artículo en la posición ${i + 1}`, 
                    success: false 
                });
            }

            // Validar existencia y stock del artículo en la base de datos.
            const idArticulo = parseInt(a.id_articulo);
            const articulo = await prisma.articulo.findUnique({
                where: {
                    id_articulo: idArticulo,
                },
            });

            if (!articulo) {
                await prisma.error_log.create({
                    data: {
                        id_usuario: req.user["id_usuario"] || null,
                        tipo_error: "Error en ingreso de datos",
                        mensaje_error: "Se intentó ingresar un artículo que no existe",
                        ruta_error: "laundry-manager/clothes/dar-ropa-de-baja",
                        codigo_http: 400
                    }
                });
                return res.status(400).json({ 
                    message: `Artículo en la posición ${i + 1} no encontrado`, 
                    success: false 
                });
            }

            if (articulo.stock < cantidad) {
                await prisma.error_log.create({
                    data: {
                        id_usuario: req.user["id_usuario"] || null,
                        tipo_error: "Error en ingreso de datos",
                        mensaje_error: "Se intentó ingresar una cantidad de artículos que supera el stock disponible",
                        ruta_error: "laundry-manager/clothes/dar-ropa-de-baja",
                        codigo_http: 400
                    }
                });
                return res.status(400).json({ 
                    message: `Stock insuficiente para el artículo en la posición ${i + 1}. Stock actual: ${articulo.stock}. Cantidad a decrementar: ${cantidad}`, 
                    success: false 
                });
            }
        }

        // Transacción para registrar la baja y actualizar el stock de los artículos.
        const resultado = await prisma.$transaction(async (prisma) => {
            // Crear el registro de la baja
            const registro = await prisma.registro.create({
                data: {
                    rut_usuario_1: parseInt(rut_usuario_1),
                    id_tipo_registro: parseInt(data.tipo_dada_de_baja),
                    id_unidad_sigcom: data.id_unidad_sigcom ? parseInt(data.id_unidad_sigcom) : null,
                    observacion: data.observaciones ? data.observaciones.toString() : null,
                    cantidad_total: data.articulos.reduce((acc, a) => acc + parseInt(a.cantidad), 0),
                    detalle_registro: {
                        create: data.articulos.map(a => ({
                            cantidad: parseInt(a.cantidad),
                            id_articulo: parseInt(a.id_articulo),
                        }))
                    },
                    fecha: fecha,
                }
            });

            // Actualizar el stock de los artículos decrementando la cantidad especificada.
            for (const a of data.articulos) {
                await prisma.articulo.update({
                    where: {
                        id_articulo: parseInt(a.id_articulo),
                    },
                    data: {
                        stock: {
                            decrement: parseInt(a.cantidad),
                        }
                    }
                });
            }

            return registro;
        });

        // Verificar si el registro fue creado correctamente.
        if (!resultado) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error de base de datos",
                    mensaje_error: "Error creando registro",
                    ruta_error: "laundry-manager/clothes/dar-ropa-de-baja",
                    codigo_http: 400
                }
            });
            return res.status(400).json({ 
                message: "Error creando registro", 
                success: false 
            });
        }

        // Si todo es exitoso, enviar una respuesta indicando el éxito.
        return res.status(200).json({ 
            message: "Registro creado exitosamente", 
            success: true 
        });
    } catch (error) {
        // Manejar errores internos del servidor y registrar el detalle en la base de datos.
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error de base de datos",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/dar-ropa-de-baja",
                codigo_http: 500
            }
        });

        // Enviar una respuesta de error interno del servidor.
        return res.status(500).json({ 
            message: "Internal server error", 
            success: false 
        });
    }
}

// FUNCIÓN PARA DECLARAR UNA PÉRDIDA DE ARTÍCULOS
async function declararPerdida(req, res) {
    try {
        // Obtener la fecha actual y formatearla
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");

        // Obtener los datos del cuerpo de la solicitud
        let data = req.body;
        const rut_usuario_1 = req.user["rutLogueado"];

        // Verificar si el tipo de pérdida es "5" y ajustar el campo de unidad sigcom
        if (data.tipo_perdida === "5") {
            data.id_unidad_sigcom = null;
        }

        // Validación de cantidad para cada artículo
        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);

            // Verificar si la cantidad es válida
            if (isNaN(cantidad) || cantidad <= 0) {
                await prisma.error_log.create({
                    data: {
                        id_usuario: req.user["id_usuario"] || null,
                        tipo_error: "Error en ingreso de datos",
                        mensaje_error: "Se intentó ingresar una cantidad de artículos no válida",
                        ruta_error: "laundry-manager/clothes/declarar-perdida",
                        codigo_http: 400
                    }
                })
                return res.status(400).json({ 
                    message: `La cantidad de cada artículo debe ser un número entero positivo. Error en artículo en la posición ${i + 1}`, 
                    success: false 
                });
            }

            // Validar si hay suficiente stock antes de proceder
            const idArticulo = parseInt(a.id_articulo);
            const articulo = await prisma.articulo.findUnique({
                where: {
                    id_articulo: idArticulo,
                },
            });

            // Verificar si el artículo existe
            if (!articulo) {
                await prisma.error_log.create({
                    data: {
                        id_usuario: req.user["id_usuario"] || null,
                        tipo_error: "Error en ingreso de datos",
                        mensaje_error: "Se intentó ingresar un artículo que no existe",
                        ruta_error: "laundry-manager/clothes/declarar-perdida",
                        codigo_http: 400
                    }
                })
                return res.status(400).json({ 
                    message: `Artículo en la posición ${i + 1} no encontrado`, 
                    success: false 
                });
            }

            // Verificar si el stock es suficiente
            if (articulo.stock < cantidad) {
                await prisma.error_log.create({
                    data: {
                        id_usuario: req.user["id_usuario"] || null,
                        tipo_error: "Error en ingreso de datos",
                        mensaje_error: "Se intentó ingresar un artículo con stock insuficiente",
                        ruta_error: "laundry-manager/clothes/declarar-perdida",
                        codigo_http: 400
                    }
                })
                return res.status(400).json({ 
                    message: `Stock insuficiente para el artículo en la posición ${i + 1}. Stock actual: ${articulo.stock}. Cantidad a decrementar: ${cantidad}`, 
                    success: false 
                });
            }
        }

        // Crear el registro de la pérdida en la base de datos
        const resultado = await prisma.$transaction(async (prisma) => {
            const registro = await prisma.registro.create({
                data: {
                    rut_usuario_1: parseInt(rut_usuario_1),
                    id_tipo_registro: parseInt(data.tipo_perdida),
                    id_unidad_sigcom: data.id_unidad_sigcom ? parseInt(data.id_unidad_sigcom) : null,
                    observacion: data.observaciones ? data.observaciones.toString() : null,
                    cantidad_total: data.articulos.reduce((acc, a) => acc + parseInt(a.cantidad), 0),
                    detalle_registro: {
                        create: data.articulos.map(a => ({
                            cantidad: parseInt(a.cantidad),
                            id_articulo: parseInt(a.id_articulo),
                        }))
                    },
                    fecha: fecha,
                }
            });

            // Actualizar el stock de los artículos
            for (const a of data.articulos) {
                await prisma.articulo.update({
                    where: {
                        id_articulo: parseInt(a.id_articulo),
                    },
                    data: {
                        stock: {
                            decrement: parseInt(a.cantidad),
                        }
                    }
                });
            }

            return registro;
        });

        // Verificar si el registro se creó correctamente
        if (!resultado) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error en ingreso de datos",
                    mensaje_error: "Error al crear el registro",
                    ruta_error: "laundry-manager/clothes/declarar-perdida",
                    codigo_http: 400
                }
            })
            return res.status(400).json({ message: "Error creando registro", success: false });
        }

        // Responder con éxito si todo ha salido bien
        return res.status(200).json({ message: "Registro creado exitosamente", success: true });
    } catch (error) {
        // Manejo de errores en caso de excepción
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/declarar-perdida",
                codigo_http: 500
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// FUNCION PARA RECIBIR ARTÍCULOS SUCIOS DESDE UNA UNIDAD SIGCOM
async function recibirSuciaUnidadSigcom(req, res) {
    try {
        // Creamos un objeto fecha con formato 'YYYY-MM-DD HH:mm:ss A' para almacenar el momento de la transacción.
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");

        // Recuperamos el rut del usuario logueado desde el objeto req.user.
        const rut_usuario_1 = req.user["rutLogueado"];
        
        // Se obtiene el cuerpo de la solicitud, que contiene los datos de los artículos y otros detalles.
        const data = req.body;

        // Iteramos a través de los artículos en la solicitud para validar la cantidad de cada uno.
        // Si la cantidad de un artículo es inválida, registramos el error y devolvemos una respuesta con un código 400.
        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);

            // Si la cantidad no es un número entero positivo, se registra un error en la base de datos y se devuelve un mensaje de error.
            if (isNaN(cantidad) || cantidad <= 0) {
                await prisma.error_log.create({
                    data: {
                        id_usuario: req.user["id_usuario"] || null,
                        tipo_error: "Error en ingreso de datos",
                        mensaje_error: "Se intentó ingresar un artículo con cantidad inválida",
                        ruta_error: "laundry-manager/clothes/recibir-sucia-unidad-sigcom",
                        codigo_http: 400
                    }
                })
                return res.status(400).json({ 
                    message: `La cantidad de cada artículo debe ser un número entero positivo. Error en artículo en la posición ${i + 1}`, 
                    success: false 
                });
            }
        }

        // Si las cantidades son válidas, se crea un registro en la base de datos con los datos del registro y los artículos.
        const result = await prisma.registro.create({
            data: {
                rut_usuario_1: parseInt(rut_usuario_1),
                rut_usuario_2: parseInt(data.rut_usuario_2),
                id_unidad_sigcom: parseInt(data.id_unidad_sigcom),
                id_tipo_registro: 2,  // 2 es el tipo de registro para "recibir sucio"
                detalle_registro: {
                    // Cada artículo es procesado y se crea su detalle en el registro
                    create: data.articulos.map(a => {
                        return {
                            cantidad: parseInt(a.cantidad),
                            id_articulo: parseInt(a.id_articulo),
                        };
                    })
                },
                cantidad_total: data.articulos.reduce((acc, a) => acc + parseInt(a.cantidad), 0),
                fecha: fecha,  // Se incluye la fecha del registro
            },
        });

        // Si no se puede crear el registro, se registra el error y se devuelve una respuesta con código 400.
        if (!result) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error en ingreso de datos",
                    mensaje_error: "Error al crear el registro",
                    ruta_error: "laundry-manager/clothes/recibir-sucia-unidad-sigcom",
                    codigo_http: 400
                }
            })
            return res.status(400).json({ message: "Error creando registro", success: false });
        }

        // Si todo sale bien, se devuelve una respuesta con código 200 y el mensaje de éxito.
        return res.status(200).json({ message: "Registro creado exitosamente", success: true });
    } catch (error) {
        // Si ocurre algún error durante el proceso, se registra el error en el log y se devuelve un error de servidor con código 500.
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/recibir-sucia-unidad-sigcom",
                codigo_http: 500
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// FUNCION PARA REGISTRAR UNA REMESA DE ROPA SUCIA
async function remesaRopaSucia(req, res) {
    try {
        // Creamos un objeto fecha con formato 'YYYY-MM-DD HH:mm:ss A' para almacenar el momento de la transacción.
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");

        // Recuperamos el rut del usuario logueado desde el objeto req.user.
        const rut_usuario_1 = req.user["rutLogueado"];
        
        // Se obtiene el cuerpo de la solicitud, que contiene los datos de los artículos y otros detalles.
        const data = req.body;

        // Iteramos a través de los artículos en la solicitud para validar la cantidad de cada uno.
        // Si la cantidad de un artículo es inválida, registramos el error y devolvemos una respuesta con un código 400.
        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);

            // Si la cantidad no es un número entero positivo, se registra un error en la base de datos y se devuelve un mensaje de error.
            if (isNaN(cantidad) || cantidad <= 0) {
                await prisma.error_log.create({
                    data: {
                        id_usuario: req.user["id_usuario"] || null,
                        tipo_error: "Error en ingreso de datos",
                        mensaje_error: "Se intentó ingresar un artículo con cantidad inválida",
                        ruta_error: "laundry-manager/clothes/remesa-ropa-sucia",
                        codigo_http: 400
                    }
                })
                return res.status(400).json({ 
                    message: `La cantidad de cada artículo debe ser un número entero positivo. Error en artículo en la posición ${i + 1}`, 
                    success: false 
                });
            }
        }

        // Si las cantidades son válidas, se crea un registro en la base de datos con los datos del registro y los artículos.
        const result = await prisma.registro.create({
            data: {
                rut_usuario_1: parseInt(rut_usuario_1),
                rut_usuario_2: null,  // No se registra rut_usuario_2 en este caso
                id_unidad_sigcom: null,  // No se registra id_unidad_sigcom en este caso
                id_tipo_registro: 3,  // 3 es el tipo de registro para "remesa de ropa sucia"
                detalle_registro: {
                    // Cada artículo es procesado y se crea su detalle en el registro
                    create: data.articulos.map(a => {
                        return {
                            cantidad: parseInt(a.cantidad),
                            id_articulo: parseInt(a.id_articulo),
                        };
                    })
                },
                cantidad_total: data.articulos.reduce((acc, a) => acc + parseInt(a.cantidad), 0),
                fecha: fecha,  // Se incluye la fecha del registro
            },
        });

        // Si no se puede crear el registro, se registra el error y se devuelve una respuesta con código 400.
        if (!result) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error en ingreso de datos",
                    mensaje_error: "Error al crear el registro",
                    ruta_error: "laundry-manager/clothes/remesa-ropa-sucia",
                    codigo_http: 400
                }
            })
            return res.status(400).json({ message: "Error creando registro", success: false });
        }

        // Si todo sale bien, se devuelve una respuesta con código 200 y el mensaje de éxito.
        return res.status(200).json({ message: "Registro creado exitosamente", success: true });
    } catch (error) {
        // Si ocurre algún error durante el proceso, se registra el error en el log y se devuelve un error de servidor con código 500.
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/remesa-ropa-sucia",
                codigo_http: 500
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// FUNCION PARA RECIBIR ROPA LIMPIA DESDE LA LAVANDERIA EXTERNA
async function recibirRopaLimpia(req, res) {
    try {
        // Creamos un objeto fecha con formato 'YYYY-MM-DD HH:mm:ss A' para almacenar el momento de la transacción.
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");

        // Obtenemos los datos de la solicitud y el rut del usuario logueado.
        const data = req.body;
        const rut_usuario_1 = req.user["rutLogueado"];

        // Iteramos a través de los artículos de la solicitud para verificar la validez de las cantidades.
        // Si la cantidad de un artículo es inválida (no es un número entero positivo), se registra el error y se responde con un mensaje de error 400.
        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);
            // Si la cantidad no es válida, se registra el error y se devuelve una respuesta con código 400.
            if (isNaN(cantidad) || cantidad <= 0) {
                await prisma.error_log.create({
                    data: {
                        id_usuario: req.user["id_usuario"] || null,
                        tipo_error: "Error en ingreso de datos",
                        mensaje_error: "Se intentó ingresar un artículo con cantidad inválida",
                        ruta_error: "laundry-manager/clothes/recibir-ropa-limpia",
                        codigo_http: 400
                    }
                })
                return res.status(400).json({ 
                    message: `La cantidad de cada artículo debe ser un número entero positivo. Error en artículo en la posición ${i + 1}`, 
                    success: false 
                });
            }
        }

        // Si las cantidades son válidas, se procede a crear un registro con los datos proporcionados en la solicitud.
        const result = await prisma.registro.create({
            data: {
                rut_usuario_1: parseInt(rut_usuario_1),
                id_tipo_registro: 4,  // 4 es el tipo de registro para "recepción de ropa limpia"
                detalle_registro: {
                    // Se crean los detalles del registro con la cantidad y el id del artículo.
                    create: data.articulos.map(a => {
                        return {
                            cantidad: parseInt(a.cantidad),
                            id_articulo: parseInt(a.id_articulo),
                        };
                    })
                },
                cantidad_total: data.articulos.reduce((acc, a) => acc + parseInt(a.cantidad), 0),
                fecha: fecha,  // Se incluye la fecha del registro
            },
        })

        // Si no se pudo crear el registro, se registra un error y se devuelve un mensaje de error 400.
        if (!result) {
            await prisma.error_log.create({
                data: {
                    id_usuario: req.user["id_usuario"] || null,
                    tipo_error: "Error en ingreso de datos",
                    mensaje_error: "Error al crear el registro",
                    ruta_error: "laundry-manager/clothes/recibir-ropa-limpia",
                    codigo_http: 400
                }
            })
            return res.status(400).json({ message: "Error creando registro", success: false });
        }

        // Si el registro se crea exitosamente, se devuelve una respuesta con código 200.
        return res.status(200).json({ message: "Registro creado exitosamente", success: true });
    } catch (error) {
        // Si ocurre un error inesperado, se registra el error en el log y se devuelve un error de servidor con código 500.
        await prisma.error_log.create({
            data: {
                id_usuario: req.user["id_usuario"] || null,
                tipo_error: "Error interno del servidor",
                mensaje_error: JSON.stringify(error),
                ruta_error: "laundry-manager/clothes/recibir-ropa-limpia",
                codigo_http: 500
            }
        })
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// EXPORTACIONES DE FUNCIONES
module.exports = {
    getArticulos,
    renderHome,
    createArticulo,
    updateArticulo,
    deleteArticulo,
    entregarUnidadSigcom,
    darRopaDeBaja,
    declararPerdida,
    recibirSuciaUnidadSigcom,
    remesaRopaSucia,
    recibirRopaLimpia,
};
