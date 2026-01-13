const userModel = require('../models/usermodel');
const nodemailer = require('nodemailer');

/* ================= CREATE USER ================= */
module.exports.createUser = async (data) => {
  const {
    fullname,
    email,
    password,
    institution,
    address,
    designation,
    contact,
    totalNumberPhysical,
    verificationToken,
    verificationTokenExpiry
  } = data;

  if (!fullname?.firstname || !email || !password) {
    throw new Error('Required fields missing');
  }

  const user = await userModel.create({
    fullname,
    email,
    password,
    institution,
    address,
    designation,
    contact,
    totalNumberPhysical,
    verificationToken,
    verificationTokenExpiry
  });

  return user;
};

/* ================= SEND VERIFICATION EMAIL ================= */
module.exports.sendVerificationEmail = async (email, token) => {
  const BASE_URL =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

  const verificationLink = `${BASE_URL}/user/verify/${token}`;

  let transporter;

  // ✅ Real Gmail
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // ⚠️ Dev fallback (Ethereal)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.warn(
      'EMAIL_USER/EMAIL_PASS not set — using Ethereal test account.'
    );
  }

  const info = await transporter.sendMail({
    from: `"Talent" <${process.env.EMAIL_USER || 'no-reply@app.com'}>`,
    to: email,
    subject: 'Verify your email',
    html: `
      <h2>Welcome  To Talent </h2>
      <p>Please verify your account by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('Verification email preview URL:', previewUrl);
  }
};
