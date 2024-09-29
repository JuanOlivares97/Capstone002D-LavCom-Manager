const { Router } = require('express');
const authController = require('../controllers/auth.controller.js')
const router = Router();

router.get('/login', authController.renderLogin)

module.exports = router;