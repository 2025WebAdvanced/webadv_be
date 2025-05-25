// src/routes/post.js
const express = require('express');
const router = express.Router();
const Post = require('../model/postModel');
const authMiddleware = require('../middleware/authMiddleware');

// 게시글 작성
router.post('/', authMiddleware, (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    userId: req.body.userId,
  });

  Post.create(post, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message || "알 수 없는 에러 발생",
      });
    }
    if (data) {
      res.json({
        code: 2001,
        message: '게시글 작성에 성공했습니다.',
        postId: data.id,
      });
    }
  });
});


// 게시글 조회
router.get('/:postId', (req, res, next) => {
  if (req.headers.authorization)
    authMiddleware(req, res, next);
}, (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.userId;

  Post.findById(postId, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message || "알 수 없는 에러 발생",
      });
    }
    if (data) {
      res.json({
        code: 1009,
        message: '게시글을 성공적으로 조회했습니다.',
        data: {
          ...data,
          isAuthor: userId && userId === data.userId,
        }
      })
    } else {
      return res.status(404).json({
        message: '게시글이 존재하지 않습니다.',
      })
    }
  })
});

// 게시글 수정
router.post('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  Post.findById(postId, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message || "알 수 없는 에러 발생",
      });
    }
    if (data) {
      if (rows[0].userId !== req.user.userId) {
        return res.status(403).json({
          code: 4003,
          message: '본인의 게시글만 수정할 수 있습니다.',
        });
      } else {
        Post.updatePost({ ...data.post, title: title, content: content,},
          (e, d) => {
            if (e)
              return res.status(500).json({ message: e.message || "알 수 없는 에러 발생" });
            return res.json({
              code: 2002,
              message: '게시글이 수정되었습니다.',
            });
        });
      }
    } else {
      return res.status(404).json({
        code: 4004,
        message: '게시글을 찾을 수 없습니다.',
      });
    }
  });
});

router.delete('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;

  Post.findById(postId, (err, post) => {
    if (err) {
      return res.status(404).json({
        code: 4004,
        message: '게시글을 찾을 수 없습니다.',
      });
    }
    if (post) {
      if (post.userId !== req.user.id) {
        return res.status(403).json({
          code: 4003,
          message: '본인 게시글만 삭제할 수 있습니다.',
        });
      } else {
        Post.delete(postId, (err, data) => {
          if (err) {
            return res.status(500).json({
              code: 5000,
              message: '서버 오류가 발생했습니다.',
            })
          } else {
            return res.json({
              code: 2003,
              message: '게시글이 삭제되었습니다.',
            })
          }
        })
      }
    }
  });
});

module.exports = router;