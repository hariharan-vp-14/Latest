const connectToDb = require("../db/db"); // ✅ ADD THIS
const userModel = require("../models/user.model");
const userService = require("../services/user.services");
const { sendPasswordResetMail, sendWelcomeEmail } = require("../services/email.services");
const RefreshToken = require("../models/refreshToken.model");
const blackListTokenModel = require("../models/blacklistToken.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

/* ================= REGISTER USER ================= */
module.exports.registerUser = async (req, res) => {
  try {
    await connectToDb(); // ✅ IMPORTANT

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
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
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = await userService.createUser({
      fullname,
      email,
      password,
      age,
      educationLevel,
      institution,
      disabilityType,
      isVerified: true
    });

    const accessToken = generateAccessToken({ id: user._id, role: "User" });
    const refreshToken = generateRefreshToken({ id: user._id, role: "User" });

    await RefreshToken.create({
      userId: user._id,
      userModel: "User",
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    try {
      await sendWelcomeEmail(user.email, "User");
    } catch (err) {
      console.warn("Welcome email failed:", err.message);
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    userResponse.role = "User";

    res.status(201).json({
      success: true,
      accessToken,
      user: userResponse
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= LOGIN USER ================= */
module.exports.loginUser = async (req, res) => {
  try {
    await connectToDb(); // ✅ IMPORTANT

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken({ _id: user._id, role: "User" });
    const refreshToken = generateRefreshToken({ _id: user._id, role: "User" });

    await RefreshToken.create({
      userId: user._id,
      userModel: "User",
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    userResponse.role = "User";

    res.status(200).json({
      success: true,
      accessToken,
      user: userResponse
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =================================================
   REFRESH ACCESS TOKEN (USER)
================================================= */
module.exports.refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Refresh token missing" });
    }

    const storedToken = await RefreshToken.findOne({
      token,
      userModel: "User"
    });

    if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    const user = await userModel.findById(storedToken.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const accessToken = generateAccessToken({
      _id: user._id,
      role: "User"
    });

    // 🔄 Generate new refresh token to extend session
    const newRefreshToken = generateRefreshToken({
      _id: user._id,
      role: "User"
    });

    // Update refresh token in database
    await RefreshToken.findByIdAndUpdate(
      storedToken._id,
      {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      { new: true }
    );

    // 🍪 Issue new refresh token cookie with fresh 7-day expiry
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    // Add role to response for consistency with frontend
    userResponse.role = 'User';

    res.status(200).json({
      success: true,
      accessToken,
      user: userResponse
    });

  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ success: false, message: "Token refresh failed" });
  }
};

/* =================================================
   FORGOT PASSWORD (USER)
================================================= */
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

/* =================================================
   RESET PASSWORD (USER)
================================================= */
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

/* =================================================
   GET USER PROFILE
================================================= */
module.exports.getUserProfile = async (req, res) => {
  res.status(200).json({
    user: req.user
  });
};

/* =================================================
   UPDATE USER PROFILE
================================================= */
module.exports.updateUserProfile = async (req, res) => {
  const { fullname, email } = req.body;

  const user = req.user;

  if (fullname) {
    user.fullname.firstname = fullname.firstname;
    user.fullname.lastname = fullname.lastname;
  }
  if (email) {
    user.email = email;
  }

  await user.save();

  res.json({ user: user });
};

/* =================================================
   LOGOUT USER
================================================= */
module.exports.logoutUser = async (req, res) => {
  const token =
    req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    await blackListTokenModel.create({ token });
  }

  res.clearCookie("token");

  res.status(200).json({ message: "Logged out successfully" });
};
