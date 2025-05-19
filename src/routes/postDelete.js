router.delete('/delete/:postId', (req, res) => {
const { postId } = req.params;

// TODO: DB에서 postId 게시글 삭제 로직

return res.status(200).json({
code: 2003,
message: '게시글 삭제에 성공했습니다.',
});
});