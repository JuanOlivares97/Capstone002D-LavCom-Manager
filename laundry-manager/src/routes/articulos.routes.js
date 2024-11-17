const { Router } = require("express");
const articulosController = require("../controllers/articulos.controller");

const router = Router();

router.get("/home", articulosController.renderHome);
router.get("/get-clothes", articulosController.getArticulos);
router.post("/create-clothes", articulosController.createArticulo);
router.put("/update-clothes", articulosController.updateArticulo);
router.delete("/delete-clothes", articulosController.deleteArticulo);

router.post("/entregar-unidad-sigcom", articulosController.entregarUnidadSigcom);
router.post("/dar-ropa-baja", articulosController.darRopaDeBaja);
router.post("/declarar-perdida", articulosController.declararPerdida);
router.post("/recibir-sucia-unidad-sigcom", articulosController.recibirSuciaUnidadSigcom);
router.post("/remesa-ropa-sucia", articulosController.remesaRopaSucia);
router.post("/recibir-ropa-limpia", articulosController.recibirRopaLimpia);

router.get("/get-records", articulosController.getRegistros);

module.exports = router;
