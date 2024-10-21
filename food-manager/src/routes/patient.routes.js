const { Router } = require('express');
const patientController = require('../controllers/patient.controller.js')
const router = Router();

router.get('/home', patientController.renderHome)
router.get('/get-pacientes', patientController.getPacientes)

router.post('/create-paciente', patientController.createPaciente)
router.get('/movements/:id', patientController.getMovimientosPaciente)
router.post('/move-service/:id', patientController.movePatientService)
router.post('/change-regimen/:id', patientController.changeRegimen)

module.exports = router;