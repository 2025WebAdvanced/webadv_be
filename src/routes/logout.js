// src/routes/auth.js
// (같은 auth.js 파일 안에 이어서 작성 가능)

router.post('/logout', (req, res) => {
// TODO: 세션 또는 토큰 삭제 로직

return res.status(200).json({
code: 1002,
message: '로그아웃에 성공했습니다.',
});
});