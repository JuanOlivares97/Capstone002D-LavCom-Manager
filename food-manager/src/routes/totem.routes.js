const express = require('express');
const router = express.Router();
const { renderTotem, registerLunchAtTotem, checkInLunch } = require('../controllers/totem.controller');

router.get('/home', renderTotem);

router.post('/check-in', checkInLunch);
router.post('/register-lunch', registerLunchAtTotem);

module.exports = router;