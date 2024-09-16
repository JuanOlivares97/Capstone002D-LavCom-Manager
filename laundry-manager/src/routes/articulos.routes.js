const { Router } = require('express');
const articulosController = require('../controllers/articulos.controller');

const router = Router();

router.get('/articulos', articulosController.getArticulos);

module.exports = router;