const { Router } = require('express');
const helpController = require('../controllers/help.controller.js')
const router = Router();

router.get('/home', helpController.renderHome)

module.exports = router;