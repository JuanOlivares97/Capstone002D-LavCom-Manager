const prisma = require('../server/prisma');
const tempo = require("@formkit/tempo");

async function renderHome(req, res) {
    try {
        return res.render('lunch/home', { tipoUsuario: 1 });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function registrationLunch(req, res) {
    try {
        const { rutSolicitante, menu } = req.body;
        var fecha = new Date();
        fecha = tempo.format(date, "YYYY-MM-DD HH:mm:ss A", "cl");
        const lunch = await prisma.Colacion.create({
            data: {
                RutSolicitante: (rutSolicitante),
                Fecha: fecha,
                Menu: menu,
                Retirado: 0
            }
        });
        return res.status(200).json({ message: "Colacion Registrada Correctamente", lunch });
    }
    catch (err) {
        return res.status(500).json({ message: "Error al Registrar Colacion ", err });
    }
}

async function checkInLunch(req, res) {
    try {
        const rutSolicitante = req.body.rutSolicitante;
        var fecha = new Date();
        fecha = tempo.format(date, "YYYY-MM-DD HH:mm:ss A", "cl");
        const colacion = await prisma.Colacion.findFirst({
            where: {
                RutSolicitante: rutSolicitante,
                fecha: fecha
            }
        });
        if (colacion) {
            const colacionActualizada = await prisma.Colacion.update({
                where: {
                    RutSolicitante: rutSolicitante,
                    fecha: fecha
                },
                data: {
                    Retirado: 1
                }
            });
            return res.status(200).json({ message: "Colacion Retirada Correctamente", colacionActualizada });
        }
        return res.status(404).json({ message: "Colacion No Encontrada" });
    }
    catch (err) {
        return res.status(500).json({ message: "Error al Retirar Colacion ", err });
    }
}
module.exports = {
    renderHome,
    registrationLunch,
    checkInLunch
}