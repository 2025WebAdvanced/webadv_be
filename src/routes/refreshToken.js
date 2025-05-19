router.post('/token', (req, res) => {
const { refreshToken } = req.body;

if (!refreshToken) {
return res.status(400).json({
code: 1900,
message: '필수 입력값이 없습니다.',
});
}

// TODO: refreshToken 검증 및 액세스 토큰 재발급 로직

return res.status(200).json({
code: 1004,
message: '토큰이 재발급 되었습니다.',
data: {
accessToken: 'newAccessTokenExample',
},
});
});