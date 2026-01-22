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
module.exports.sendVerificationEmail = async (email, token, role = 'Administrator') => {
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
    console.log("📧 Admin account creation email preview:", previewUrl);
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
