const { Router } = require('express');
const patientController = require('../controllers/patient.controller.js')
const router = Router();

router.get('/home', patientController.renderHome)

module.exports = router;