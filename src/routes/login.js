// src/routes/auth.js
const express = require('express');
const router = express.Router();

// 로그인 API 예시
router.post('/login', (req, res) => {
  const { email, username, password } = req.body;

  // 예시: 유효성 검사
  if (!email || !username || !password) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  // 실제로는 DB에서 유저 확인, 비밀번호 체크 등 진행
  if (password !== 'expectedPassword') {
    return res.status(400).json({
      code: 1901,
      message: '비밀번호가 일치하지 않습니다.',
    });
  }

  // 로그인 성공 응답
  return res.status(200).json({
    code: 1001,
    message: '로그인에 성공했습니다.',
  });
});

module.exports = router;
