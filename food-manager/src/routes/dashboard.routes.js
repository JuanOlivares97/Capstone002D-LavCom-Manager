const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller.js')
const router = Router();

router.get('/home', dashboardController.renderDashboard)

module.exports = router;