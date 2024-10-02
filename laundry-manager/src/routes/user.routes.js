const { Router } = require('express');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/home', userController.renderHome)

router.get('/get-usuarios', userController.getUsuarios);

router.post('/create-user', userController.createUsuario)

module.exports = router;