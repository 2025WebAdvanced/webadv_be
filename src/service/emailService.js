// src/service/emailService.js
const nodemailer = require('nodemailer');

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6자리
}

exports.sendVerificationEmail = async (email) => {
  const code = generateCode();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,      // .env 설정 필요
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Community" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '이메일 인증 코드',
    text: `당신의 인증 코드는 ${code} 입니다.`,
  };

  await transporter.sendMail(mailOptions);
  return code;
};
