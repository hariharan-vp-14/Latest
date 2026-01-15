const administratorModel = require("../models/administratormodel");
const hostModel = require("../models/hostmodel");
const eventModel = require("../models/event.model");
const nodemailer = require("nodemailer");

/* =================================================
   CREATE ADMINISTRATOR
================================================= */
module.exports.createAdministrator = async (data) => {
  const {
    firstname,
    lastname,
    email,
    password,
    verificationToken,
    verificationTokenExpiry
  } = data;

  if (!firstname || !email || !password) {
    throw new Error("Required fields missing");
  }

  const admin = await administratorModel.create({
    fullname: { firstname, lastname },
    email,
    password,
    verificationToken,
    verificationTokenExpiry
  });

  return admin;
};

/* =================================================
   SEND VERIFICATION EMAIL (ADMIN)
================================================= */
module.exports.sendVerificationEmail = async (email, token) => {
  const BASE_URL =
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 4000}`;

  const verificationLink = `${BASE_URL}/administrator/verify/${token}`;

  let transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // fallback for testing (ethereal)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.warn("⚠️ Using Ethereal test email account");
  }

  const info = await transporter.sendMail({
    from: `"TalentConnect Pro" <${process.env.EMAIL_USER || "no-reply@app.com"}>`,
    to: email,
    subject: "Verify your administrator account",
    html: `
      <h2>Welcome to TalentConnect Pro (Admin)</h2>
      <p>Please verify your account by clicking the link below:</p>
      <a href="${verificationLink}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("📧 Admin verification email preview:", previewUrl);
  }
};

/* =================================================
   ADMIN DASHBOARD STATS
================================================= */
module.exports.getDashboardStats = async () => {
  const totalAdmins = await administratorModel.countDocuments();
  const totalHosts = await hostModel.countDocuments();
  const totalEvents = await eventModel.countDocuments();

  const pendingEvents = await eventModel.countDocuments({
    approvalStatus: "pending"
  });

  const approvedEvents = await eventModel.countDocuments({
    approvalStatus: "approved"
  });

  const rejectedEvents = await eventModel.countDocuments({
    approvalStatus: "rejected"
  });

  return {
    totalAdmins,
    totalHosts,
    totalEvents,
    pendingEvents,
    approvedEvents,
    rejectedEvents
  };
};
