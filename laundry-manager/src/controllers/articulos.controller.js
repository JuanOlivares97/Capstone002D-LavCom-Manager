const prisma = require("../server/prisma");
const tempo = require("@formkit/tempo");

async function renderHome(req, res) {
    try {
        const usuarios = await prisma.usuarios.findMany({
            where: {
                borrado: false,
            },
        });
        const unidades_sigcom = await prisma.unidad_sigcom.findMany();
        res.render("clothes/home", { usuarios, unidades_sigcom });
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
            include: {
                subgrupo_ropa: true,
            },
        });
        return res.status(200).json(articulos);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function createArticulo(req, res) {
    try {
        const newArticulo = {
            nombre_articulo: req.body.nombre,
            stock: parseInt(req.body.stock),
            id_subgrupo_ropa: parseInt(req.body.subgrupo),
            borrado: false,
        };
        const articulo = await prisma.articulo.create({
            data: newArticulo,
        });
        if (!articulo) {
            return res.status(400).json({ message: "Error creating user" });
        }
        return res
            .status(201)
            .json({ message: "Articulo creado exitosamente" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server  error  " + error });
    }
}

async function updateArticulo(req, res) {
    try {
        const articulo = {
            nombre_articulo: req.body.nombre,
            stock: parseInt(req.body.stock),
            id_subgrupo_ropa: parseInt(req.body.subgrupo),
            borrado: false,
        };
        const articulos = await prisma.articulo.update({
            where: {
                id_articulo: parseInt(req.body.id_articulo),
            },
            data: articulo,
        });
        if (!articulos) {
            return res.status(400).json({ message: "Error updating user" });
        }

        return res
            .status(200)
            .json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error  " + error });
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
            return res.status(400).json({ message: "Error deleting user" });
        }
        return res
            .status(200)
            .json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error  " + error });
    }
}

async function entregarUnidadSigcom(req, res) {
    try {
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");
        const data = req.body;
        const result = await prisma.registro.create({
            data: {
                rut_usuario_1: parseInt(data.rut_usuario_1),
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
            return res.status(400).json({ message: "Error creating registro" });
        }   

        return res.status(200).json({ message: "Registro creado exitosamente" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function darRopaDeBaja(req, res) {
    try {
        var fecha = new Date();
        fecha = tempo.format(fecha, "YYYY-MM-DD HH:mm:ss A", "cl");
        const data = req.body;
        const resultado = await prisma.$transaction(async (prisma) => {
            const registro = await prisma.registro.create({
                data: {
                    rut_usuario_1: parseInt(data.rut_usuario_1),
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

        return res.status(200).json({ message: "Registro creado exitosamente", data: resultado });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
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
};
