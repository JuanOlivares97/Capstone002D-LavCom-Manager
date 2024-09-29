const { Router } = require('express');
const reportController = require('../controllers/report.controller.js')
const router = Router();

router.get('/home', reportController.renderHome)

module.exports = router;