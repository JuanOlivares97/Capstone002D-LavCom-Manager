const { Router } = require('express');
const patientController = require('../controllers/patient.controller.js')
const router = Router();

router.get('/home', patientController.renderHome)
router.get('/get-pacientes', patientController.getPacientes)
router.get('/movements/:id', patientController.getMovimientosPaciente)
router.get('/searc-patient/:rut', patientController.getPaciente)

router.post('/create-paciente', patientController.createPaciente)

router.put('/change-fasting-date/:id', patientController.changeFastingDate)
router.put('/indicar-alta/:id', patientController.indicarAlta)
router.put('/move-service/:id', patientController.movePatientService)
router.put('/change-regimen/:id', patientController.changeRegimen)
router.put('/change-observations-sala/:id', patientController.changeObservacionesGenerales)
router.put('/change-observations-nutricionista/:id', patientController.changeObservacionesNutricionista)
router.put('/change-observations-alta/:id', patientController.changeObservacionesAlta)
router.put('/change-via/:id', patientController.changeVia),
router.put('/change-unidad/:id', patientController.movePatientUnidad)
router.put('/remove-fasting/:id', patientController.removeFastingDate)

router.patch('/edit-patient', patientController.editPaciente)

module.exports = router;