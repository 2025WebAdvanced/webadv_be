// src/routes/post.js
const express = require('express');
const router = express.Router();
const Post = require('../model/postModel');

router.post('/', (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
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

router.get('/:postId', (req, res) => {
  const { postId } = req.params;

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
        data: data,
      })
    } else {
      return res.status(404).json({
        message: '게시글이 존재하지 않습니다.',
      })
    }
  })
});

module.exports = router;