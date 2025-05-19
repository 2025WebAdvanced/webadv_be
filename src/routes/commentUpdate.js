router.put('/modify/:commentId', (req, res) => {
const { commentId } = req.params;
const { content } = req.body;

if (!content) {
return res.status(400).json({
code: 1900,
message: '필수 입력값이 없습니다.',
});
}

// TODO: DB에서 댓글 수정 로직

return res.status(200).json({
code: 3002,
message: '댓글 수정에 성공했습니다.',
});
});