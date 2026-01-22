const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");
const hostModel = require("../models/hostmodel");
const administratorModel = require("../models/administratormodel");

/* =================================================
   UNIFIED AUTH MIDDLEWARE (FIXED)
================================================= */
module.exports = async (req, res, next) => {
  try {
    // ✅ IMPORTANT: Authorization header MUST take priority
    let token = null;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    console.log("🔐 Auth Middleware - Token check:");
    console.log("   - Cookie token:", req.cookies?.token ? "✓ Present" : "✗ Missing");
    console.log("   - Authorization header:", req.headers.authorization ? "✓ Present" : "✗ Missing");
    console.log("   - Final token source:", req.headers.authorization ? "Authorization Header" : "Cookie");
    console.log("   - Final token:", token ? "✓ Present" : "✗ Missing");

    if (!token) {
      console.warn("❌ No token found - returning 401");
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Check blacklist (logout)
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      console.warn("❌ Token is blacklisted");
      return res.status(401).json({
        message: "Token is invalid or already logged out",
      });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("✅ Token verified successfully - decoded._id:", decoded._id);

      const nowSeconds = Math.floor(Date.now() / 1000);
      const remainingSeconds = decoded.exp - nowSeconds;

      console.log("   - Token exp time:", new Date(decoded.exp * 1000).toISOString());
      console.log("   - Current time:", new Date(nowSeconds * 1000).toISOString());
      console.log("   - Remaining (seconds):", remainingSeconds);
    } catch (jwtErr) {
      console.error("❌ JWT verification failed:", jwtErr.message);

      if (jwtErr.name === "TokenExpiredError") {
        const decodedExpired = jwt.decode(token);
        const nowSeconds = Math.floor(Date.now() / 1000);
        const expiredSeconds = nowSeconds - decodedExpired.exp;

        console.error("   - Token expired:", expiredSeconds, "seconds ago");
        console.error(
          "   - Token exp time:",
          new Date(decodedExpired.exp * 1000).toISOString()
        );
        console.error(
          "   - Current time:",
          new Date(nowSeconds * 1000).toISOString()
        );

        return res.status(401).json({ message: "Token expired" });
      }

      return res.status(401).json({ message: "Invalid token" });
    }

    let user = null;

    // ✅ Host check (UNCHANGED)
    console.log("   - Looking for Host with _id:", decoded._id);
    user = await hostModel.findById(decoded._id);
    if (user) {
      console.log("✅ User found as Host:", user._id);
      req.user = {
        id: user._id,
        role: "host",
        email: user.email,
        fullname: user.fullname,
      };
      console.log("   - req.user.role set to:", req.user.role);
      return next();
    }

    // ✅ Administrator check (UNCHANGED)
    console.log("   - Looking for Administrator with _id:", decoded._id);
    user = await administratorModel.findById(decoded._id);
    if (user) {
      console.log("✅ User found as Administrator:", user._id);
      req.user = {
        id: user._id,
        role: "administrator",
        email: user.email,
        fullname: user.fullname,
      };
      console.log("   - req.user.role set to:", req.user.role);
      return next();
    }

    console.warn("❌ User not found in any collection - decoded._id:", decoded._id);
    return res.status(401).json({ message: "Unauthorized user" });
  } catch (err) {
    console.error("❌ Auth middleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
