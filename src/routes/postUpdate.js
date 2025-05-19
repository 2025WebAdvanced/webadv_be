router.put('/modify/:postId', (req, res) => {
const { postId } = req.params;
const { title, content } = req.body;

if (!title || !content) {
return res.status(400).json({
code: 1900,
message: '필수 입력값이 없습니다.',
});
}

// TODO: DB에서 postId 게시글 수정 로직

return res.status(200).json({
code: 2002,
message: '게시글 수정에 성공했습니다.',
});
});