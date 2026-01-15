const administratorModel = require("../models/administratormodel");
const administratorService = require("../services/administrator.services");
const { sendPasswordResetMail } = require("../services/email.services");
const blackListTokenModel = require("../models/blacklistToken.model");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

/* =================================================
   REGISTER ADMINISTRATOR
================================================= */
module.exports.registerAdministrator = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if maximum 5 administrators limit is reached
  const adminCount = await administratorModel.countDocuments();
  if (adminCount >= 5) {
    return res.status(400).json({ message: "Maximum of 5 administrators allowed. Cannot register more administrators." });
  }

  const { fullname, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingAdmin = await administratorModel.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({ message: "Administrator already exists" });
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const admin = await administratorService.createAdministrator({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password,
    verificationToken,
    verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000
  });

  await administratorService.sendVerificationEmail(
    admin.email,
    verificationToken
  );

  res.status(201).json({
    message: "Administrator registered. Please verify your email before login."
  });
};

/* =================================================
   LOGIN ADMINISTRATOR
================================================= */
module.exports.loginAdministrator = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const admin = await administratorModel
    .findOne({ email })
    .select("+password");

  if (!admin) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!admin.isVerified) {
    return res
      .status(403)
      .json({ message: "Please verify your email before logging in" });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = admin.generateAuthToken();

  res
    .cookie("token", {
      httpOnly: true,
      sameSite: "lax"
    })
    .status(200)
    .json({
      message: "Login successful",
      token,
      admin
    });
};

/* =================================================
   VERIFY ADMIN EMAIL
================================================= */
module.exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  const admin = await administratorModel.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: Date.now() }
  });

  if (!admin) {
    return res
      .status(400)
      .json({ message: "Invalid or expired verification link" });
  }

  admin.isVerified = true;
  admin.verificationToken = undefined;
  admin.verificationTokenExpiry = undefined;

  await admin.save();

  res.status(200).json({
    message: "Email verified successfully. You can now login."
  });
};

/* =================================================
   🔐 FORGOT PASSWORD (ADMIN)
================================================= */
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const admin = await administratorModel.findOne({ email });
  if (!admin) {
    return res.status(404).json({ message: "Administrator not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  admin.resetPasswordToken = resetToken;
  admin.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

  await admin.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/admin/${resetToken}`;

  await sendPasswordResetMail(admin.email, resetLink, "Administrator");

  res.status(200).json({
    message: "Password reset link sent to your email"
  });
};

/* =================================================
   🔐 RESET PASSWORD (ADMIN)
================================================= */
module.exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const admin = await administratorModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpiry: { $gt: Date.now() }
  }).select("+password");

  if (!admin) {
    return res.status(400).json({
      message: "Invalid or expired reset token"
    });
  }

  admin.password = password;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpiry = undefined;

  await admin.save();

  res.status(200).json({
    message: "Password reset successful. You can now login."
  });
};

/* =================================================
   GET ADMIN PROFILE
================================================= */
module.exports.getAdministratorProfile = async (req, res) => {
  res.status(200).json({
    user: req.user
  });
};

/* =================================================
   LOGOUT ADMINISTRATOR
================================================= */
module.exports.logoutAdministrator = async (req, res) => {
  const token =
    req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    await blackListTokenModel.create({ token });
  }

  res.clearCookie("token");

  res.status(200).json({ message: "Logged out successfully" });
};

/* =================================================
   ADMIN DASHBOARD STATS
================================================= */
module.exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await administratorService.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
