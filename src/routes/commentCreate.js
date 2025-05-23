// src/routes/commentCreate.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../model/db');

router.post('/write', authMiddleware, async (req, res) => {
  const { postId, content } = req.body;
  const author = req.user.username; // JWT 토큰에서 가져온 사용자 이름

  if (!postId || !content) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  try {
    // 댓글 DB 저장 쿼리
    await db.query(
      'INSERT INTO comments (post_id, content, author) VALUES (?, ?, ?)',
      [postId, content, author]
    );

    return res.status(200).json({
      code: 3001,
      message: '댓글 작성에 성공했습니다.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      code: 5000,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
