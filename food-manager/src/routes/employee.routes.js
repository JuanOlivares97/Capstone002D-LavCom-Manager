const { Router } = require('express');
const employeeController = require('../controllers/employee.controller.js')
const router = Router();

router.get('/home', employeeController.renderHome)
router.get('/get-funcionarios', employeeController.getFuncionarios)

module.exports = router;