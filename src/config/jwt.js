const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT = {
  err: null,
  user: {},
  accessToken: '',
  refreshToken: '',
  expiresIn: null,

  async jwtAccessTokenExtractor(req) {
    const authAccess = req.headers.authorization;

    if (!authAccess || !authAccess.startsWith('Bearer ')) {
      this.err = { message: '액세스 토큰이 없습니다.' };
      return this;
    }

    const access = authAccess.split(' ')[1];

    try {
      const decoded = await jwt.verify(access, process.env.JWT_SECRET);
      this.user = {
        email: decoded.email,
        username: decoded.username,
      };
    } catch (e) {
      this.err = { 
        message: '토큰 추출 중 오류가 발생했습니다.' ,
      };
    }

    return this;
  },

  async jwtRefreshTokenExtractor(req) {
    const authRefresh = req.headers.authorization;

    if (!authRefresh || !authRefresh.startsWith('Bearer ')) {
      this.err = { message: '리프레시 토큰이 없습니다.' };
      return this;
    }

    const refresh = authRefresh.split(' ')[1];

    try {
      const decoded = await jwt.verify(refresh, process.env.JWT_REFRESH_SECRET);
      this.user = {
        email: decoded.email,
        username: decoded.username,
      };
    } catch (e) {
      this.err = {
        message: '토큰 추출 중 오류가 발생했습니다.',
      };
    }

    return this;
  },

  async getExpireFromRefreshToken(refreshToken) {
    if (!refreshToken.startsWith('Bearer ')) {
      this.err = { message: '리프레시 토큰이 없습니다.'};
      return this;
    }

    const refresh = refreshToken.split(' ')[1];

    try {
      const decoded = await jwt.verify(refresh, process.env.JWT_REFRESH_SECRET);
      this.expiresIn = decoded.exp;
    } catch (e) {
      this.err = {
        message: '토큰 추출 중 오류가 발생했습니다.',
        error: e,
      };
    }

    return this;
  },

  async jwtTokenProvider(user) {
    try {
      this.accessToken = 'Bearer ' + await jwt.sign(
        { email: user.email, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      this.refreshToken = 'Bearer ' + await jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET, // 수정: 이 부분도 다른 secret을 사용
        { expiresIn: '1h' }
      );
    } catch (e) {
      this.err = {
        message: '토큰 생성 중 오류가 발생했습니다.',
      };
    }

    return this;
  },

  async jwtAccessTokenRefresher(req) {
    const authRefresh = req.headers.authorization;

    if (!authRefresh || !authRefresh.startsWith('Bearer')) {
      this.err = {
        code: 1908,
        message: '리프레시 토큰이 없습니다.',
      };
      return this;
    }

    const result = await this.jwtRefreshTokenExtractor(req);
    if (result.err) {
      this.err = {
        code: 1907,
        message: '유효하지 않은 리프레시 토큰입니다.',
      };
      return this;
    }

    return await this.jwtTokenProvider(this.user);
  }
};

module.exports = JWT;