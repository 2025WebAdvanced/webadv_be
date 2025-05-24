// src/routes/commentCreate.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');

router.post('/write', authMiddleware, async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.userId; // JWT 토큰에서 가져온 사용자 이름

  if (!postId || !content) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  const comment = {
    content: content,
    userId: userId,
    postId: postId,
  }

  Comment.create(comment, (err, data) => {
    if (err) {
      return res.status(500).json({
        code: 5000,
        message: '서버 오류가 발생했습니다.',
      })
    } else {
      return res.json({
        code: 3001,
        message: '댓글 작성에 성공했습니다.',
      })
    }
  });
});

module.exports = router;