// src/routes/post.js
const express = require('express');
const router = express.Router();
const Post = require('../model/postModel');

router.post('/', (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    res.status(400).json({
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
      res.status(500).send({
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

module.exports = router;