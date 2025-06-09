// src/routes/emailService.js
const express = require('express');
const router = express.Router();
const emailController = require('../controller/emailController');

router.post('/verify/request', emailController.requestVerification);
router.post('/verify/check', emailController.verifyCode);

module.exports = router;

