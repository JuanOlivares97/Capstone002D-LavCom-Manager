const { Router } = require('express');
const reportesController = require('../controllers/reportes.controller');

const router = Router();

router.get('/home', reportesController.renderHome);
router.get('/get-report', reportesController.getFullReport);
router.get('/get-services-report', reportesController.getServicesReport);
router.get('/get-bajas-perdidas', reportesController.getBajasyPerdidas);
router.get('/get-bajas-services', reportesController.getServicesDownReport);

module.exports = router;