const hostModel = require('../models/hostmodel');
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

  const user = await hostModel.create({
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

/* ================= SEND WELCOME EMAIL ================= */
module.exports.sendWelcomeEmail = async (email, role = 'Host') => {
  let transporter;

  // ✅ Real Gmail
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // ⚠️ Dev fallback (Ethereal)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransporter({
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
    subject: `Welcome to Talent - ${role} Account Created`,
    html: `
      <h2>Welcome To Talent</h2>
      <p>You have successfully created a <strong>${role}</strong> account.</p>
      <p>Your account is now active and ready to use.</p>
      <p>Thank you for joining Talent!</p>
    `
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('Account creation email preview URL:', previewUrl);
  }
};
