router.delete('/delete/:commentId', (req, res) => {
const { commentId } = req.params;

// TODO: DB에서 댓글 삭제 로직

return res.status(200).json({
code: 3003,
message: '댓글 삭제에 성공했습니다.',
});
});