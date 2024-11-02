const { Router } = require('express');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/home', userController.renderHome)

router.get('/get-users', userController.getUsuarios);

router.post('/create-user', userController.createUsuario)

router.delete('/delete-user', userController.deleteUsuario)

module.exports = router;