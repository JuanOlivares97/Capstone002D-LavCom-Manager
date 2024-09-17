const { Router } = require('express');
const articulosController = require('../controllers/articulos.controller');

const router = Router();

router.get('/home', articulosController.renderHome)
router.get('/get-clothes', articulosController.getArticulos);

module.exports = router;