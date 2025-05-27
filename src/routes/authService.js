// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const JWT = require('../config/jwt');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../model/userModel');
const Token = require('../model/tokenModel');
require('dotenv').config();

// 비밀번호 해싱 메소드
const hashedPassword = async (password) => {
  return await bcrypt.hash(password, 10);
}

// 액세스 토큰 재발급
router.get('/reissue', (req, res) => {
  if (!req.headers.authorization) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }
  
  const { err, accessToken, refreshToken } = JWT.jwtAccessTokenRefresher(req);
  if (err) {
    res.status(401).json({
      code: err.code,
      message: err.message,
    })
  } else {
    res.status(200).json({
      code: 1004,
      message: '토큰이 재발급 되었습니다.',
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    })
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  await User.findByEmail(email, async (err, data) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send({
        message: err.message || "알 수 없는 오류 발생"
      });
    } 
    if (!data) {
      return res.status(404).json({
        code: 1902,
        message: '존재하지 않는 사용자입니다.',
      });
    }
    await bcrypt.compare(password, data.password, async (bcryptErr, result) => {
      if (bcryptErr) {
        return res.status(500).json({
          message: "서버 오류가 발생했습니다."
        });
      }
      if (!result) {
        return res.status(400).json({
          code: 1901,
          message: '비밀번호가 일치하지 않습니다.'
        });
      }

      const { err, accessToken, refreshToken } = await JWT.jwtTokenProvider(data);
      if (err) {
        return res.status(500).json({
          message: "토큰 생성 중 오류가 발생했습니다."
        });
      }
      if (data) {
        return res.json({
          code: 1001, 
          message: '로그인에 성공했습니다.',
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      }
    });
  });
});

// 로그아웃
router.post('/logout', authMiddleware, (req, res) => {
  // 리프레시 토큰 exp 추출
  const expiresIn = JWT.getExpireFromRefreshToken(req.body.refresh).expiresIn;
  const expiresDate = new Date(expiresIn * 1000);
  const token = {
    userId: req.user.id,
    refreshToken: req.body.refresh,
    expiresAt: expiresDate, 
  }

  // 블랙리스트의 전체 토큰 중 기간 만료된 토큰 삭제
  Token.deleteDeprecated();

  Token.findByRefreshToken(req.body.refresh, (err, data) => {
    if (err) {
      return res.status(500).json({
        code: 5000,
        message: '서버 오류가 발생했습니다.\n' + err,
      });
    } else {
      console.log(data);
      if (data.length > 0) {
        return res.status(401).json({
          code: 4001,
          message: '로그아웃한 사용자의 리프레시 토큰입니다.',
        })
      } else {
        // 토큰 블랙리스트에 추가
        Token.create(token, (err, data) => {
          if (err) {
            return res.status(500).json({
              code: 5000,
              message: '서버 오류가 발생했습니다.',
            });
          } else {
            return res.json({
              code: 1002,
              message: '로그아웃에 성공했습니다.',
            })
          }
        });
      }
    }
  });
})

// 회원 가입
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
    } else if (data) {
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

router.post('/withdrawal', authMiddleware, async (req, res) => {
  if (!req.body.password) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  await bcrypt.compare(req.body.password, req.user.password, (err, result) => {
    if (err) {
      return res.status(401).json({
        code: 1901,
        message: '비밀번호가 일치하지 않습니다.'
      })
    }
    else {
      User.delete(req.user.id, (err, data) => {
        if (err) {
          return res.status(500).json({
            message: "서버 오류가 발생했습니다.",
          });
        } else {
          return res.json({
            code: 1003,
            message: '회원 탈퇴에 성공했습니다.',
          });
        }
      });
    }
  });
});

module.exports = router;
