const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../config/db');

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // 이메일 중복 확인
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({
        code: 1900,
        message: '이미 존재하는 이메일입니다.',
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성
    await db.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword]
    );

    res.status(201).json({
      code: 1000,
      message: '회원가입에 성공했습니다.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 1500,
      message: '서버 오류',
    });
  }
});

module.exports = router;
