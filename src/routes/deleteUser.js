router.delete('/withdrawal', (req, res) => {
const { email, username, password } = req.body;

if (!email || !username || !password) {
return res.status(400).json({
code: 1900,
message: '필수 입력값이 없습니다.',
});
}

// TODO: DB에서 사용자 확인 후 회원 삭제 로직 작성

return res.status(200).json({
code: 1003,
message: '회원 탈퇴에 성공했습니다.',
});
});