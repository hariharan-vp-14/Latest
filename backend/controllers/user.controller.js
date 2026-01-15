const userModel = require("../models/user.model");
const userService = require("../services/user.services");
const { sendPasswordResetMail } = require("../services/email.services");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");
const crypto = require("crypto");

/* ================= REGISTER USER ================= */
module.exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullname,
    email,
    password,
    confirmPassword,
    age,
    educationLevel,
    institution,
    disabilityType
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await userService.createUser({
    fullname,
    email,
    password,
    age,
    educationLevel,
    institution,
    disabilityType,
    verificationToken,
    verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000
  });

  await userService.sendVerificationEmail(user.email, verificationToken);

  res.status(201).json({
    message: "User registered. Please verify your email before login."
  });
};

/* ================= VERIFY EMAIL ================= */
module.exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  const user = await userModel.findOne({
    verificationToken: token,
    verificationTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired verification link"
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;

  await user.save();

  res.json({
    message: "Email verified successfully. You can now login."
  });
};

/* ================= LOGIN USER ================= */
module.exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.isVerified) {
    return res.status(401).json({
      message: "Please verify your email before logging in"
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token, { httpOnly: true });

  res.json({ token, user });
};

/* ================= 🔐 FORGOT PASSWORD ================= */
module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/user/${resetToken}`;

  await sendPasswordResetMail(user.email, resetLink, "User");

  res.status(200).json({
    message: "Password reset link sent to your email"
  });
};

/* ================= 🔐 RESET PASSWORD ================= */
module.exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpiry: { $gt: Date.now() }
  }).select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired reset token"
    });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;

  await user.save();

  res.status(200).json({
    message: "Password reset successful. You can now login."
  });
};

/* ================= PROFILE ================= */
module.exports.getUserProfile = async (req, res) => {
  res.json({ user: req.user });
};

/* ================= LOGOUT ================= */
module.exports.logoutUser = async (req, res) => {
  const token =
    req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    await blackListTokenModel.create({ token });
  }

  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
