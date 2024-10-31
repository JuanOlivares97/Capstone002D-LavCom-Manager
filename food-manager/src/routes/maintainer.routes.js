const { Router } = require('express');
const maintainerController = require('../controllers/maintainer.controller.js')
const router = Router();

router.get('/home', maintainerController.renderHome)

router.post('/create-regimen', maintainerController.createTipoRegimen);
router.post('/create-servicio', maintainerController.createService);
router.post('/create-estamento', maintainerController.createEstamento);
router.post('/create-unidad', maintainerController.createUnidad);
router.post('/create-via', maintainerController.createVia);
router.post('/create-tipo-funcionario', maintainerController.createTipoFuncionario);
router.post('/create-contrato', maintainerController.createContrato);


module.exports = router;