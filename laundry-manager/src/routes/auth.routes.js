const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.get('/login', authController.renderLogin); 
router.get('/recuperar_pwd_form', authController.renderRecuperarContrasenaForm);
router.get('/recuperar_pwd_info', authController.renderRecuperarContrasenaInfo);
router.post('/login', authController.login);

module.exports = router;