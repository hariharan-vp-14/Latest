const hostModel = require("../models/hostmodel");
const hostService = require("../services/host.services");
const { sendPasswordResetMail, sendWelcomeEmail } = require("../services/email.services");
const RefreshToken = require("../models/refreshToken.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

/* ================= REGISTER HOST ================= */
module.exports.registerHost = async (req, res) => {
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
      institution,
      address,
      designation,
      contact,
      totalNumberPhysical
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const existingHost = await hostModel.findOne({ email });
    if (existingHost) {
      return res.status(400).json({ success: false, message: "Host already exists" });
    }

    const host = await hostService.createUser({
      fullname,
      email,
      password,
      institution,
      address,
      designation,
      contact,
      totalNumberPhysical,
      isVerified: true
    });

    // ✅ FIX: lowercase role
    const accessToken = generateAccessToken({
      _id: host._id,
      role: "host"
    });

    const refreshToken = generateRefreshToken({
      _id: host._id,
      role: "host"
    });

    await RefreshToken.create({
      userId: host._id,
      userModel: "Host",
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    await sendWelcomeEmail(host.email, "Host");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const hostResponse = host.toObject();
    delete hostResponse.password;
    hostResponse.role = "host";

    return res.status(201).json({
      success: true,
      accessToken,
      user: hostResponse
    });

  } catch (err) {
    console.error("Host registration error:", err);
    res.status(500).json({ success: false, message: "Host registration failed" });
  }
};

/* ================= LOGIN HOST ================= */
module.exports.loginHost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const host = await hostModel.findOne({ email }).select("+password");
    if (!host) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await host.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // ✅ FIX: issue BOTH tokens
    const accessToken = generateAccessToken({
      _id: host._id,
      role: "host"
    });

    const refreshToken = generateRefreshToken({
      _id: host._id,
      role: "host"
    });

    await RefreshToken.create({
      userId: host._id,
      userModel: "Host",
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const hostResponse = host.toObject();
    delete hostResponse.password;
    hostResponse.role = "host";

    console.log("✅ Host login successful - access & refresh token issued");

    return res.status(200).json({
      success: true,
      accessToken,
      user: hostResponse
    });

  } catch (err) {
    console.error("Host login error:", err);
    res.status(500).json({ success: false, message: "Host login failed" });
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

    const host = await hostModel.findOne({ email });
    if (!host) {
      return res.status(404).json({ success: false, message: "Host not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    host.resetPasswordToken = hashedToken;
    host.resetPasswordExpiry = Date.now() + 3600000; // 1 hour
    await host.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendPasswordResetMail(email, resetLink);

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

    const host = await hostModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!host) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    host.password = password;
    host.resetPasswordToken = undefined;
    host.resetPasswordExpiry = undefined;
    await host.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};

/* ================= PROFILE ================= */
module.exports.getHostProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};

/* ================= UPDATE PROFILE ================= */
module.exports.updateHostProfile = async (req, res) => {
  try {
    const hostId = req.user.id;
    const { fullname, institution, address, designation, contact, totalNumberPhysical } = req.body;

    const host = await hostModel.findByIdAndUpdate(
      hostId,
      {
        fullname,
        institution,
        address,
        designation,
        contact,
        totalNumberPhysical
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!host) {
      return res.status(404).json({ success: false, message: "Host not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: host
    });

  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

/* ================= LOGOUT ================= */
module.exports.logoutHost = async (req, res) => {
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

    // Fetch the host with the ID from the token
    const host = await hostModel.findById(payload._id).select("-password");
    if (!host) {
      return res.status(404).json({ success: false, message: "Host not found" });
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
      user: { ...host.toObject ? host.toObject() : host, role: 'host' }
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ success: false, message: "Failed to refresh token" });
  }
};
