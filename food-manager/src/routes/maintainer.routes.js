const { Router } = require('express');
const maintainerController = require('../controllers/maintainer.controller.js')
const router = Router();

router.get('/home', maintainerController.renderHome)

module.exports = router;