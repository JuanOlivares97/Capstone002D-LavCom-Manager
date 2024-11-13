const { Router } = require('express');
const lunchController = require('../controllers/lunch.controller.js')
const router = Router();

router.get('/home', lunchController.renderHome)
router.get('/list', lunchController.renderLunchList);
    
router.post('/register-lunch', lunchController.registrationLunch);

router.put('/update-lunch/:id', lunchController.registrarColacionRetirada);



module.exports = router;