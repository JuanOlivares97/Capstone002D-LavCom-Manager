const { Router } = require('express');
const reportesController = require('../controllers/reportes.controller');

const router = Router();

router.get('/home', reportesController.renderHome);
router.get('/get-report', reportesController.getFullReport);
router.get('/get-services-report', reportesController.getServicesReport);
router.get('/get-bajas-perdidas', reportesController.getBajasyPerdidas);
router.get('/get-bajas-services', reportesController.getServicesDownReport);
router.get("/get-records", reportesController.getRegistros);
router.get("/get-general-date/:mes/:anio/:tipo", reportesController.generalReportDate);
router.get("/get-bp-date/:mes/:anio", reportesController.getBajasyPerdidasDate);
router.get("/get-general-date-usigcom/:mes/:anio/:tipo/:usigcom", reportesController.generalReportDateUsigcom);
router.get("/get-bp-date-usigcom/:mes/:anio/:usigcom", reportesController.getBajasyPerdidasDateUsigcom);

router.get("/get-daily-report/:fecha/:tipo", reportesController.getDailyReport)
router.get("/get-bp-daily/:fecha", reportesController.getDailyBp);

router.get("/get-daily-report-usigcom/:fecha/:tipo/:usigcom", reportesController.getDailyReportUsigcom)
router.get("/get-bp-daily-usigcom/:fecha/:usigcom", reportesController.getDailyBpUsigcom);

module.exports = router;