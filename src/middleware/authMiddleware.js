const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    User.findByEmail(decoded.email, (err, data) => {
      if (err) {
        return res.status(500).json({
          message: '서버 오류가 발생했습니다.',
        });
      } else {
        req.user = data;
        next();
      }
    })
  } catch (err) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
}

module.exports = authMiddleware;