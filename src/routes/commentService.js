// src/routes/commentService.js
const express = require('express');
const router = express.Router();
const commentModel = require('../model/commentModel');

// 댓글 조회 API (PostId + 페이지네이션)
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const comments = await commentModel.getCommentsByPostId(postId, limit, offset);
    const total = await commentModel.getTotalCommentsCount(postId);

    res.status(200).json({
      code: 1000,
      message: '댓글 목록 조회 성공',
      data: {
        comments,
        pagination: {
          total,
          page,
          limit,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 1500,
      message: '서버 오류가 발생했습니다.',
    });
  }
});

module.exports = router;
