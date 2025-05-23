const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post('/token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      code: 1900,
      message: '필수 입력값이 없습니다.',
    });
  }

  try {
    // refreshToken 검증
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // 새 accessToken 생성
    const accessToken = jwt.sign(
      { email: decoded.email, username: decoded.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      code: 1004,
      message: '토큰이 재발급 되었습니다.',
      data: {
        accessToken,
      },
    });
  } catch (err) {
    return res.status(401).json({
      code: 1902,
      message: '유효하지 않은 리프레시 토큰입니다.',
    });
  }
});
