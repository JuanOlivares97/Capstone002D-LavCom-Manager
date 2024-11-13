const { Router } = require('express');
const reportController = require('../controllers/report.controller.js')
const router = Router();

router.get('/home', reportController.renderHome)

router.get('/fill-table', reportController.fillTable)

router.get('/reporte-hospitalizados-diario', reportController.reportHospitalizadoDiario);

module.exports = router;