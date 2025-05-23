// src/routes/auth.js
const express = require('express');
const User = require('../model/authModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 비밀번호 해싱 메소드
const hashedPassword = async (password) => {
  return await bcrypt.hash(password, 10);
}

// 로그인 API 예시
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  User.findByEmail(email, async (err, data) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "알 수 없는 오류 발생"
      });
    } else {
      if (data.length === 0) {
        res.status(404).json({
          code: 1902,
          message: '존재하지 않는 사용자입니다.',
        });
      } else {
        await bcrypt.compare(password, data[0].password, (err, result) => {
          if (result) {
            const token = JWTTokenProvider(req.body);
            res.json({
              code: 1001,
              message: '로그인에 성공했습니다.',
              accessToken: token.accessToken,
              refreshToken: token.refreshToken,
            });
          } else
            res.status(400).json({
              code: 1901,
              message: `비밀번호가 일치하지 않습니다.`
            });
        });
      }
    }
  });
});

router.post('/signup', async (req, res) => {
  const { email, username, password, univ } = req.body;

  // 유효성 검사
  if (!email, !username, !password, !univ) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.'
    })
  }

  // 이메일 중복 확인
  User.findByEmail(email, (err, data) => {
    if (err) {
      console.log(err.message);
      res.status(500).send({
        message: err.message || "알 수 없는 오류 발생"
      });
    } else if (data.length > 0) {
      return res.status(400).json({
        code: 1901,
        message: '이미 존재하는 이메일입니다.',
      });
    }
  });

  // 유저 생성
  User.create({ ...req.body, password: await hashedPassword(password) }, (err, data) => {
    if (err) {
      console.log(err.message);
      res.status(500).json({
        message: err.message || "알 수 없는 오류 발생"
      });
    } else {
      res.status(200).json({
        code: 1000,
        message: '회원가입에 성공했습니다.',
      })
    }
  })
});

module.exports = router;
