// src/routes/commentService.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Comment = require('../model/commentModel');

// 댓글 작성
router.post('/', authMiddleware, async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.id;

  if (!postId || !content) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  const comment = { content, userId, postId };

  Comment.create(comment, (err, data) => {
    if (err) {
      return res.status(500).json({
        code: 5000,
        message: '서버 오류가 발생했습니다.',
      });
    } else {
      return res.json({
        code: 3001,
        message: '댓글 작성에 성공했습니다.',
      });
    }
  });
});

// 댓글 수정
router.post('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  Comment.getCommentById(commentId, (getCommentErr, getCommentRes) => {
    if (getCommentErr) {
      return res.status(404).json({
        code: 3004,
        message: '댓글이 존재하지 않습니다.',
      });
    } else {
      if (getCommentRes.userId !== req.user.id) {
        return res.status(401).json({
          code: 3005,
          message: '본인 댓글만 수정할 수 있습니다.',
        });
      } else {
        const comment = {
          ...getCommentRes,
          content,
        };
        Comment.update(comment, (err, data) => {
          if (err) {
            return res.status(500).json({
              code: 5000,
              message: err || "알 수 없는 서버 오류가 발생했습니다.",
            });
          } else {
            return res.json({
              code: 3002,
              message: '댓글 수정에 성공했습니다.',
            });
          }
        });
      }
    }
  });
});

// 댓글 삭제
router.delete('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;

  Comment.getCommentById(commentId, (err, comment) => {
    if (err) {
      return res.status(404).json({
        code: 3004,
        message: '삭제할 댓글을 찾을 수 없습니다.',
      });
    }
    if (comment && comment.userId == req.user.id) {  // 여기서 userId 비교로 수정함
      Comment.delete(commentId, (err, data) => {
        if (err) {
          return res.status(500).json({
            code: 5000,
            message: '서버 오류가 발생했습니다.',
          });
        }
        if (data) {
          res.json({
            code: 3003,
            message: '댓글 삭제에 성공했습니다.',
          });
        }
      });
    } else {
      return res.status(401).json({
        code: 3005,
        message: '본인 댓글만 삭제할 수 있습니다.',
      });
    }
  });
});

// 댓글 목록 조회 (PostId + 페이지네이션)
router.get('/posts/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const comments = await Comment.getCommentsByPostId(postId, limit, offset);
    const total = await Comment.getTotalCommentsCount(postId);

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
