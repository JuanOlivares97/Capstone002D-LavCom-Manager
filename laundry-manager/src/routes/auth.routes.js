const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.get('/login', authController.renderLogin); 
router.get('/recuperar-pwd-form', authController.renderRecuperarContrasenaForm);
router.post('/send-pwd-mail', authController.sendPwdEmail)
router.get('/recuperar-pwd-info', authController.renderRecuperarContrasenaInfo);
router.post('/login', authController.login);
router.put('/set-email', authController.setEmail);
router.put('/change-pwd', authController.changePwd);

router.post('/logout', authController.logout);

module.exports = router;