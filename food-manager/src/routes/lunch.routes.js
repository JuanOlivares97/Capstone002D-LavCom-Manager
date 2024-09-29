const { Router } = require('express');
const lunchController = require('../controllers/lunch.controller.js')
const router = Router();

router.get('/home', lunchController.renderHome)

module.exports = router;