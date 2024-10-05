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

module.exports = router;
