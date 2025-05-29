// src/routes/login.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(400).json({
        code: 1902,
        message: '존재하지 않는 사용자입니다.',
      });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        code: 1901,
        message: '비밀번호가 일치하지 않습니다.',
      });
    }

    // accessToken, refreshToken 생성
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Tokens 테이블에 저장 (기존 토큰 삭제하고 새로 저장)
    await db.query('DELETE FROM Tokens WHERE userId = ?', [user.id]);
    await db.query(
      'INSERT INTO Tokens (userId, accessToken, refreshToken, expiresAt) VALUES (?, ?, ?, ?)',
      [user.id, accessToken, refreshToken, expiresAt]
    );

    // 로그인 성공 응답 + 토큰 전달
    return res.status(200).json({
      code: 1001,
      message: '로그인에 성공했습니다.',
      accessToken,
      refreshToken,
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
