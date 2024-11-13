const { Router } = require('express');
const employeeController = require('../controllers/employee.controller.js')
const router = Router();

router.get('/home', employeeController.renderHome)
router.get('/get-funcionarios', employeeController.getFuncionarios)

router.post('/create-empleado', employeeController.createEmployee)

router.put('/update-empleado/:id', employeeController.updateEmployee)

router.delete('/delete-empleado/:id', employeeController.deleteEmployee)

module.exports = router;