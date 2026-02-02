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

    const accessToken = generateAccessToken({
      id: user._id,
      role: "User"
    });

    const refreshToken = generateRefreshToken({
      id: user._id,
      role: "User"
    });

    await RefreshToken.create({
      userId: user._id,
      userModel: "User",
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, 'User');
      console.log("✅ Welcome email sent to user:", user.email);
    } catch (err) {
      console.warn("⚠️ User welcome email failed:", err.message);
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    // Add role to response for consistency with frontend
    userResponse.role = 'User';

    res.status(201).json({
      success: true,
      accessToken,
      user: userResponse
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

/* ================= LOGIN USER ================= */
module.exports.loginUser = async (req, res) => {
  try {
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

    const accessToken = generateAccessToken({
      _id: user._id,
      role: "User"
    });

    const refreshToken = generateRefreshToken({
      _id: user._id,
      role: "User"
    });

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
    // Add role to response for consistency with frontend
    userResponse.role = 'User';

    res.status(200).json({
      success: true,
      accessToken,
      user: userResponse
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

/* ================= REFRESH ACCESS TOKEN ================= */
module.exports.refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Refresh token missing" });
    }

    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }

    const payload = require("jsonwebtoken").verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    // Fetch the user with the ID from the token
    const user = await userModel.findById(payload._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newAccessToken = generateAccessToken({
      _id: payload._id,
      role: payload.role
    });

    // 🔄 Generate new refresh token to extend session
    const newRefreshToken = generateRefreshToken({
      _id: payload._id,
      role: payload.role
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

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: { ...user.toObject ? user.toObject() : user, role: 'User' }
    });

  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ success: false, message: "Token refresh failed" });
  }
};

/* ================= FORGOT PASSWORD ================= */
module.exports.forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendPasswordResetMail(email, resetLink, "User");

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully"
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ success: false, message: "Failed to send reset email" });
  }
};

/* ================= RESET PASSWORD ================= */
module.exports.resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};

/* ================= GET USER PROFILE ================= */
module.exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

/* ================= UPDATE USER PROFILE ================= */
module.exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstname, lastname, age, institution, educationLevel, disabilityType } = req.body;

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        fullname: { firstname, lastname },
        age,
        institution,
        educationLevel,
        disabilityType
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });

  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

/* ================= LOGOUT ================= */
module.exports.logoutUser = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await RefreshToken.deleteOne({ token });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });
    res.json({ success: true, message: "Logged out successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};
