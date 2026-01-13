const userModel = require('../models/usermodel');
const userService = require('../services/user.services');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');
const crypto = require('crypto');

/* ================= REGISTER ================= */
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
    institution,
    address,
    designation,
    contact,
    totalNumberPhysical
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // 🔐 generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await userService.createUser({
    fullname,
    email,
    password, // auto-hashed in model
    institution,
    address,
    designation,
    contact,
    totalNumberPhysical,
    verificationToken,
    verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000 // 24h
  });

  // 📧 send verification email
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

/* ================= LOGIN ================= */
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
