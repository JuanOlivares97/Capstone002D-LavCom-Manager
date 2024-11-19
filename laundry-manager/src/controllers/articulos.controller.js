const prisma = require("../server/prisma");
const tempo = require("@formkit/tempo");

async function renderHome(req, res) {
    try {
        const rutLogueado = req.user["rutLogueado"]
        const nombreLogueado = req.user["nombreLogueado"]
        const usuarios = await prisma.usuarios.findMany({
            where: {
                borrado: false,
            },
        });
        const unidades_sigcom = await prisma.unidad_sigcom.findMany();
        const tipo_user = req.user["tipo_usuario"];
        res.status(200).render("clothes/home", { usuarios, unidades_sigcom, tipo_usuario: tipo_user, rutLogueado, nombreLogueado });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getArticulos(req, res) {
    try {
        const articulos = await prisma.articulo.findMany({
            where: {
                borrado: false,
            },
        });
        
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
        
        return res.status(200).json(articulosConSubgrupo);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error"});
    }
}

async function createArticulo(req, res) {
    try {

        const existingArticulo = await prisma.articulo.findUnique({
            where: {
                nombre_articulo: req.body.nombre,
            },
        })

        if (existingArticulo) {
            return res.status(400).json({ message: "El artículo ya existe, es posible que este se encuentre deshabilitado, contacte al administrador", success: false });
        }

        const stock = parseInt(req.body.stock);
        if (isNaN(stock) || stock <= 0) {
            return res.status(400).json({ message: "Stock debe ser un número entero positivo", success: false });
        }

        const newArticulo = {
            nombre_articulo: req.body.nombre,
            stock: stock,
            id_subgrupo_ropa: parseInt(req.body.subgrupo),
            borrado: false,
        };
        const articulo = await prisma.articulo.create({
            data: newArticulo,
            include: {
                subgrupo_ropa: true,
            }
        });
        if (!articulo) {
            return res.status(400).json({ message: "Error al crear artículo" , success: false});
        }
        return res.status(200).json({ message: "Articulo creado exitosamente", success: true, articulo });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function updateArticulo(req, res) {
    try {
        const stock = parseInt(req.body.stock);
        if (isNaN(stock) || stock <= 0) {
            return res.status(400).json({ message: "Stock debe ser un número entero positivo", success: false });
        }

        const existingArticulo = await prisma.articulo.findFirst({
            where: {
                nombre_articulo: req.body.nombre,
                id_articulo: {
                    not: parseInt(req.body.id_articulo), // Asegurarse de que no coincida con el ID del artículo que estás actualizando
                },
            },
        });
        
        if (existingArticulo) {
            return res.status(400).json({ 
                message: "El artículo ya existe, es posible que este se encuentre deshabilitado, contacte al administrador", 
                success: false 
            });
        }

        const articulo = {
            nombre_articulo: req.body.nombre,
            stock: stock,
            id_subgrupo_ropa: parseInt(req.body.subgrupo),
            borrado: false,
        };
        const articulo_actualizado = await prisma.articulo.update({
            where: {
                id_articulo: parseInt(req.body.id_articulo),
            },
            data: articulo,
            include: {
                subgrupo_ropa: true,
            }
        });
        if (!articulo_actualizado) {
            return res.status(400).json({ message: "Error al actualizar artículo", success: false });
        }

        return res.status(200).json({ message: "Artículo actualizado exitosamente", success: true, articulo_actualizado });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function deleteArticulo(req, res) {
    try {
        const articulo = await prisma.articulo.update({
            where: {
                id_articulo: parseInt(req.body.id_articulo),
            },
            data: {
                borrado: true,
            },
        });
        if (!articulo) {
            return res.status(400).json({ message: "Error al eliminar artículo", success: false });
        }
        return res.status(200).json({ message: "Articulo eliminado exitosamente", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function entregarUnidadSigcom(req, res) {
    try {
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");
        const data = req.body;
        const rut_usuario_1 = req.user["rutLogueado"];

        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);
            if (isNaN(cantidad) || cantidad <= 0) {
                return res.status(400).json({ 
                    message: `La cantidad de cada artículo debe ser un número entero positivo. Error en artículo en la posición ${i + 1}`, 
                    success: false 
                });
            }
        }

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
        })

        if (!result) {
            return res.status(400).json({ message: "Error creando registro", success: false });
        }   

        return res.status(200).json({ message: "Registro creado exitosamente", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function darRopaDeBaja(req, res) {
    try {
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");
        let data = req.body;
        const rut_usuario_1 = req.user["rutLogueado"];
        if (data.tipo_dada_de_baja === "8") {
            data.id_unidad_sigcom = null;
        }

        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);
            if (isNaN(cantidad) || cantidad <= 0) {
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

            if (!articulo) {
                return res.status(400).json({ 
                    message: `Artículo en la posición ${i + 1} no encontrado`, 
                    success: false 
                });
            }

            if (articulo.stock < cantidad) {
                return res.status(400).json({ 
                    message: `Stock insuficiente para el artículo en la posición ${i + 1}. Stock actual: ${articulo.stock}. Cantidad a decrementar: ${cantidad}`, 
                    success: false 
                });
            }
        }

        const resultado = await prisma.$transaction(async (prisma) => {
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

        if (!resultado) {
            return res.status(400).json({ message: "Error creando registro", success: false });
        }

        return res.status(200).json({ message: "Registro creado exitosamente", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function declararPerdida(req, res) {
    try {
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");
        let data = req.body;
        const rut_usuario_1 = req.user["rutLogueado"];
        if (data.tipo_perdida === "5") {
            data.id_unidad_sigcom = null;
        }

        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);
            if (isNaN(cantidad) || cantidad <= 0) {
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

            if (!articulo) {
                return res.status(400).json({ 
                    message: `Artículo en la posición ${i + 1} no encontrado`, 
                    success: false 
                });
            }

            if (articulo.stock < cantidad) {
                return res.status(400).json({ 
                    message: `Stock insuficiente para el artículo en la posición ${i + 1}. Stock actual: ${articulo.stock}. Cantidad a decrementar: ${cantidad}`, 
                    success: false 
                });
            }
        }

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

        if (!resultado) {
            return res.status(400).json({ message: "Error creando registro", success: false });
        }

        return res.status(200).json({ message: "Registro creado exitosamente", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function recibirSuciaUnidadSigcom(req, res) {
    try {
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");
        const rut_usuario_1 = req.user["rutLogueado"];
        const data = req.body;

        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);
            if (isNaN(cantidad) || cantidad <= 0) {
                return res.status(400).json({ 
                    message: `La cantidad de cada artículo debe ser un número entero positivo. Error en artículo en la posición ${i + 1}`, 
                    success: false 
                });
            }
        }

        const result = await prisma.registro.create({
            data: {
                rut_usuario_1: parseInt(rut_usuario_1),
                rut_usuario_2: parseInt(data.rut_usuario_2),
                id_unidad_sigcom: parseInt(data.id_unidad_sigcom),
                id_tipo_registro: 2,
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
        })

        if (!result) {
            return res.status(400).json({ message: "Error creando registro", success: false });
        }   

        return res.status(200).json({ message: "Registro creado exitosamente", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function remesaRopaSucia(req, res) {
    try {
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");
        const rut_usuario_1 = req.user["rutLogueado"];
        const data = req.body;

        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);
            if (isNaN(cantidad) || cantidad <= 0) {
                return res.status(400).json({ 
                    message: `La cantidad de cada artículo debe ser un número entero positivo. Error en artículo en la posición ${i + 1}`, 
                    success: false 
                });
            }
        }

        const result = await prisma.registro.create({
            data: {
                rut_usuario_1: parseInt(rut_usuario_1),
                rut_usuario_2: null,
                id_unidad_sigcom: null,
                id_tipo_registro: 3,
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
        })

        if (!result) {
            return res.status(400).json({ message: "Error creando registro", success: false });
        }   

        return res.status(200).json({ message: "Registro creado exitosamente", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

async function recibirRopaLimpia(req, res) {
    try {
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");
        const data = req.body;
        const rut_usuario_1 = req.user["rutLogueado"];

        for (let i = 0; i < data.articulos.length; i++) {
            const a = data.articulos[i];
            const cantidad = parseInt(a.cantidad);
            if (isNaN(cantidad) || cantidad <= 0) {
                return res.status(400).json({ 
                    message: `La cantidad de cada artículo debe ser un número entero positivo. Error en artículo en la posición ${i + 1}`, 
                    success: false 
                });
            }
        }
        
        const result = await prisma.registro.create({
            data: {
                rut_usuario_1: parseInt(rut_usuario_1),
                id_tipo_registro: 4,
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
        })

        if (!result) {
            return res.status(400).json({ message: "Error creando registro", success: false });
        }   

        return res.status(200).json({ message: "Registro creado exitosamente", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

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
