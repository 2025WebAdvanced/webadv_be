// src/routes/commentUpdate.js
const express = require('express');
const router = express.Router();
const db = require('../model/db');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/modify/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const username = req.user.username; // 토큰에서 username 추출

  if (!content) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  try {
    // 댓글 작성자 조회
    const [rows] = await db.query('SELECT author FROM comments WHERE id = ?', [commentId]);
    if (rows.length === 0) {
      return res.status(404).json({
        code: 3004,
        message: '댓글이 존재하지 않습니다.',
      });
    }

    if (rows[0].author !== username) {
      return res.status(403).json({
        code: 3005,
        message: '본인 댓글만 수정할 수 있습니다.',
      });
    }

    // 댓글 수정
    await db.query('UPDATE comments SET content = ? WHERE id = ?', [content, commentId]);

    return res.status(200).json({
      code: 3002,
      message: '댓글 수정에 성공했습니다.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 5000,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
