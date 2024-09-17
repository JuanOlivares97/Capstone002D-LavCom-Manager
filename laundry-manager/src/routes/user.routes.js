const { Router } = require('express');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/get-usuarios', userController.getUsuarios);

module.exports = router;