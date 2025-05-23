const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../model/db');

router.delete('/delete/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;

  try {
    const [result] = await db.execute('DELETE FROM comments WHERE id = ?', [commentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        code: 3004,
        message: '삭제할 댓글을 찾을 수 없습니다.',
      });
    }

    return res.status(200).json({
      code: 3003,
      message: '댓글 삭제에 성공했습니다.',
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
