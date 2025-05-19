// src/routes/post.js
const express = require('express');
const router = express.Router();

router.post('/write', (req, res) => {
const { title, content, author } = req.body;

if (!title || !content || !author) {
return res.status(400).json({
code: 1900,
message: '필수 입력값이 없습니다.',
});
}

// TODO: DB에 게시글 저장 로직

return res.status(200).json({
code: 2001,
message: '게시글 작성에 성공했습니다.',
});
});

module.exports = router;