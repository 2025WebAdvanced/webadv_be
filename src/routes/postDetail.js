const express = require('express');
const router = express.Router();
const db = require('../model/db');
const authMiddleware = require('../middleware/authMiddleware');

// 게시글 상세보기
router.get('/detail/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;

  try {
    const [rows] = await db.query('SELECT id, title, content, author, created_at FROM posts WHERE id = ?', [postId]);
    if (rows.length === 0) {
      return res.status(404).json({
        code: 4004,
        message: '게시글을 찾을 수 없습니다.',
      });
    }
    return res.status(200).json({
      code: 2001,
      message: '게시글 상세 조회 성공',
      data: rows[0],
    });
  } catch (error) {
    console.error('게시글 상세조회 오류:', error);
    return res.status(500).json({
      code: 5000,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
