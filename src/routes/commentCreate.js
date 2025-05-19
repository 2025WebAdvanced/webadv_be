// src/routes/comment.js
const express = require('express');
const router = express.Router();

router.post('/write', (req, res) => {
const { postId, content, author } = req.body;

if (!postId || !content || !author) {
return res.status(400).json({
code: 1900,
message: '필수 입력값이 없습니다.',
});
}

// TODO: DB에 댓글 저장 로직

return res.status(200).json({
code: 3001,
message: '댓글 작성에 성공했습니다.',
});
});

module.exports = router;