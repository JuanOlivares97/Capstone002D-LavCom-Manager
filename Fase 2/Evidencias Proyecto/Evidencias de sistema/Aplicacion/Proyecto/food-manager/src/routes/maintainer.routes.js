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


router.put('/update-regimen/:id', maintainerController.updateTipoRegimen);
router.put('/update-servicio/:id', maintainerController.updateService);
router.put('/update-estamento/:id', maintainerController.updateEstamento);
router.put('/update-unidad/:id', maintainerController.updateUnidad);
router.put('/update-via/:id', maintainerController.updateVia);
router.put('/update-tipo-funcionario/:id', maintainerController.updateTipoFuncionario);
router.put('/update-contrato/:id', maintainerController.updateContrato);


router.delete('/delete-regimen/:id', maintainerController.deleteRegimen);
router.delete('/delete-servicio/:id', maintainerController.deleteService);
router.delete('/delete-unidad/:id', maintainerController.deleteUnidad);

module.exports = router;