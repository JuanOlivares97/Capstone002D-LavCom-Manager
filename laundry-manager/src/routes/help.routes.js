const { Router } = require('express');
const helpController = require('../controllers/help.controller');

const router = Router();

router.get('/home', helpController.showHome); 


module.exports= router