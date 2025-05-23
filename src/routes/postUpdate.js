const express = require('express');
const router = express.Router();
const db = require('../model/db');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/update/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const username = req.user.username;

  if (!title || !content) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  try {
    // 작성자 확인 (자기 게시글인지 체크)
    const [rows] = await db.query('SELECT author FROM posts WHERE id = ?', [postId]);
    if (rows.length === 0) {
      return res.status(404).json({
        code: 4004,
        message: '게시글을 찾을 수 없습니다.',
      });
    }

    if (rows[0].author !== username) {
      return res.status(403).json({
        code: 4003,
        message: '본인 게시글만 수정할 수 있습니다.',
      });
    }

    // 게시글 수정
    await db.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, postId]);

    return res.status(200).json({
      code: 2002,
      message: '게시글이 수정되었습니다.',
    });
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    return res.status(500).json({
      code: 5000,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
