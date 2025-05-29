// src/controller/emailController.js
const emailService = require('../service/emailService');
const db = require('../config/db');

// 인증 메일 요청 API
exports.requestVerification = async (req, res) => {
  const { email } = req.body;
  try {
    const code = await emailService.sendVerificationEmail(email);

    // 인증 코드 DB에 저장 (중복이면 갱신)
    await db.query(
      'INSERT INTO EmailVerifications (email, code, createdAt) VALUES (?, ?, NOW()) ON DUPLICATE KEY UPDATE code = ?, createdAt = NOW()',
      [email, code, code]
    );

    res.status(200).json({ message: '인증 이메일이 전송되었습니다.' });
  } catch (error) {
    console.error('이메일 전송 오류:', error);
    res.status(500).json({ message: '이메일 전송 실패' });
  }
};

// 인증 코드 확인 API
exports.verifyCode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const [[result]] = await db.query(
      'SELECT * FROM EmailVerifications WHERE email = ? AND code = ?',
      [email, code]
    );

    if (!result) {
      return res.status(400).json({ message: '인증 코드가 일치하지 않습니다.' });
    }

    // 인증 성공 시 DB에서 삭제하거나 인증 여부 표시
    await db.query('DELETE FROM EmailVerifications WHERE email = ?', [email]);

    res.status(200).json({ message: '이메일 인증이 완료되었습니다.' });
  } catch (error) {
    console.error('인증 오류:', error);
    res.status(500).json({ message: '서버 오류로 인증에 실패했습니다.' });
  }
};
