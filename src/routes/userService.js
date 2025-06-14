const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../model/userModel');
require('dotenv').config();

router.get('/detail', authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(403).json({
      message: '권한이 없습니다.'
    })
  }
  return res.json({
    code: 1014,
    message: '유저 정보가 조회되었습니다.',
    data: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      univ: req.user.univ,
    },
  });
});

module.exports = router;