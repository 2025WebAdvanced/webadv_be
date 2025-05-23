// src/routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 필수 입력값 체크
  if (!email || !password) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  try {
    // DB에서 사용자 조회
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(400).json({
        code: 1902,
        message: '존재하지 않는 사용자입니다.',
      });
    }

    const user = results[0];

    // 비밀번호 해시 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        code: 1901,
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    // JWT 토큰 생성 (payload에 user id, email 등 포함)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 로그인 성공 응답 + 토큰 전달
    return res.status(200).json({
      code: 1001,
      message: '로그인에 성공했습니다.',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 1500,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
