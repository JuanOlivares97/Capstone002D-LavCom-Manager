const { Router } = require('express');
const reportesController = require('../controllers/reportes.controller');

const router = Router();

router.get('/home', reportesController.renderHome);
router.get('/get-report', reportesController.getFullReport);

module.exports = router;