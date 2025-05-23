const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const sql = require('../model/db');

router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  try {
    // 이메일 중복 확인
    const [existingUser] = await sql.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({
        code: 1901,
        message: '이미 존재하는 이메일입니다.',
      });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 유저 생성ㄴ
    await sql.query(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword]
    );

    return res.status(201).json({
      code: 1000,
      message: '회원가입에 성공했습니다.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 1999,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
