// src/routes/commentCreate.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Comment = require('../model/commentModel');

router.post('/', authMiddleware, async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.id;

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
    if(getCommentErr) {
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
          content: content,
        }
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
    };
  })
});

module.exports = router;