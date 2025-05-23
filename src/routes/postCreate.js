const express = require('express');
const router = express.Router();
const db = require('../model/db');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/write', authMiddleware, async (req, res) => {
  const { title, content } = req.body;
  const author = req.user.username; // 미들웨어에서 넣어준 사용자 정보

  // 필수 값 체크
  if (!title || !content) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  try {
    // 게시글 저장 쿼리
    const sql = 'INSERT INTO posts (title, content, author) VALUES (?, ?, ?)';
    await db.query(sql, [title, content, author]);

    return res.status(200).json({
      code: 2001,
      message: '게시글 작성에 성공했습니다.',
    });
  } catch (error) {
    console.error('게시글 저장 오류:', error);
    return res.status(500).json({
      code: 5000,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
