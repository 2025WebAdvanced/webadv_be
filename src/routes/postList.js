router.get('/list', (req, res) => {
// TODO: DB에서 게시글 목록 조회 로직
const posts = [
{ id: 1, title: '첫번째 게시글', author: 'user1', date: '2025-05-15' },
{ id: 2, title: '두번째 게시글', author: 'user2', date: '2025-05-16' },
];

return res.status(200).json({
code: 2004,
message: '게시글 목록 조회에 성공했습니다.',
data: posts,
});
});