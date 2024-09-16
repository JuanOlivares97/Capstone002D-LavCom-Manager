const { Router } = require('express');
const reportesController = require('../controllers/reportes.controller');

const router = Router();

router.get('/home', reportesController.showHome);

module.exports = router;