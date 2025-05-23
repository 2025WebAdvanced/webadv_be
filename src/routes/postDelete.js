const express = require('express');
const router = express.Router();
const db = require('../model/db');
const authMiddleware = require('../middleware/authMiddleware');

router.delete('/delete/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const username = req.user.username;

  try {
    // 게시글 존재 여부 및 작성자 확인
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
        message: '본인 게시글만 삭제할 수 있습니다.',
      });
    }

    // 게시글 삭제
    await db.query('DELETE FROM posts WHERE id = ?', [postId]);

    return res.status(200).json({
      code: 2003,
      message: '게시글이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    return res.status(500).json({
      code: 5000,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
