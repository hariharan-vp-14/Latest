const administratorModel = require("../models/administratormodel");
const administratorService = require("../services/administrator.services");
const { sendPasswordResetMail, sendWelcomeEmail } = require("../services/email.services");
const RefreshToken = require("../models/refreshToken.model");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
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

  const admin = await administratorService.createAdministrator({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password,
    isVerified: true
  });

  // Send welcome email
  try {
    await sendWelcomeEmail(admin.email, 'Administrator');
    console.log("✅ Welcome email sent to admin:", admin.email);
  } catch (err) {
    console.warn("⚠️ Admin welcome email failed:", err.message);
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    _id: admin._id,
    role: "Administrator"
  });

  const refreshToken = generateRefreshToken({
    _id: admin._id,
    role: "Administrator"
  });

  // Store refresh token in database
  await RefreshToken.create({
    userId: admin._id,
    userModel: "Administrator",
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  const adminResponse = admin.toObject();
  delete adminResponse.password;
  // Add role to response for consistency with frontend
  adminResponse.role = 'Administrator';

  res.status(201).json({
    accessToken,
    user: adminResponse,
    message: "Administrator account created successfully!"
  });
};

/* =================================================
   LOGIN ADMINISTRATOR
================================================= */
module.exports.loginAdministrator = async (req, res) => {
  try {
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

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      _id: admin._id,
      role: "Administrator"
    });

    const refreshToken = generateRefreshToken({
      _id: admin._id,
      role: "Administrator"
    });

    // Store refresh token in database
    await RefreshToken.create({
      userId: admin._id,
      userModel: "Administrator",
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Send login notification email
    try {
      const { sendLoginNotificationMail } = require("../services/email.services");
      await sendLoginNotificationMail(admin.email, "Administrator");
    } catch (emailError) {
      console.warn("Login notification email failed:", emailError.message);
      // Don't fail login if email fails
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      sameSite: 'lax'
    });

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;
    // Add role to response for consistency with frontend
    adminResponse.role = 'Administrator';

    res.status(200).json({ accessToken, user: adminResponse });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

/* =================================================
   REFRESH ACCESS TOKEN (ADMIN)
================================================= */
module.exports.refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Refresh token missing" });
    }

    const storedToken = await RefreshToken.findOne({
      token,
      userModel: "Administrator"
    });

    if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    const admin = await administratorModel.findById(storedToken.userId);
    if (!admin) {
      return res.status(401).json({ success: false, message: "Administrator not found" });
    }

    const accessToken = generateAccessToken({
      _id: admin._id,
      role: "Administrator"
    });

    // 🔄 Generate new refresh token to extend session
    const newRefreshToken = generateRefreshToken({
      _id: admin._id,
      role: "Administrator"
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

    const adminResponse = admin.toObject();
    delete adminResponse.password;
    // Add role to response for consistency with frontend
    adminResponse.role = 'Administrator';

    res.status(200).json({
      success: true,
      accessToken,
      user: adminResponse
    });

  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ success: false, message: "Token refresh failed" });
  }
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
   UPDATE ADMIN PROFILE
================================================= */
module.exports.updateAdministratorProfile = async (req, res) => {
  const { fullname, email } = req.body;

  const admin = req.user;

  if (fullname) {
    admin.firstname = fullname.firstname;
    admin.lastname = fullname.lastname;
  }
  if (email) {
    admin.email = email;
  }

  await admin.save();

  res.json({ user: admin });
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
