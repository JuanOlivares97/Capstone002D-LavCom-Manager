const { Router } = require('express');
const dashboardController = require('../controllers/dashboard.controller');

const router = Router();

router.get('/home', dashboardController.showHome); 


module.exports= router
