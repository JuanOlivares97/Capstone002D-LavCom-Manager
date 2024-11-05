const express = require('express');
const router = express.Router();
const { renderTotem, registerLunchAtTotem } = require('../controllers/totem.controller');

router.get('/home', renderTotem);

router.post('/totem/check-in', registerLunchAtTotem);
router.post('/totem/register-lunch', registerLunchAtTotem);

module.exports = router;