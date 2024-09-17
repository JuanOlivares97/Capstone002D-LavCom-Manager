const { Router } = require('express');
const userController = require('../controllers/auth.controller');

const router = Router();

router.get('/login', userController.renderLogin); 
router.get('/recuperar_pwd_form', userController.renderRecuperarContrasenaForm);
router.get('/recuperar_pwd_info', userController.renderRecuperarContrasenaInfo);

module.exports = router;