const { Router } = require('express');
const lunchController = require('../controllers/lunch.controller.js')
const router = Router();

router.get('/home', lunchController.renderHome)

router.post('/register-lunch', lunchController.registrationLunch);

module.exports = router;