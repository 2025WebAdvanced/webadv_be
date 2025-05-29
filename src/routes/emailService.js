// src/routes/emailService.js
const express = require('express');
const router = express.Router();
const { sendVerificationEmailHandler } = require('../controller/emailController');

router.post('/verify-email', sendVerificationEmailHandler);

module.exports = router;
