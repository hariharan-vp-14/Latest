const connectToDb = require("../db/db"); // ✅ ADD THIS
const userModel = require("../models/user.model");
const userService = require("../services/user.services");
const { sendPasswordResetMail, sendWelcomeEmail } = require("../services/email.services");
const RefreshToken = require("../models/refreshToken.model");
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
