const { Router } = require('express');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/home', userController.showHome)

router.get('/get-users', userController.getUsuarios);

module.exports = router;