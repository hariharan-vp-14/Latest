const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");
const hostModel = require("../models/hostmodel");
const administratorModel = require("../models/administratormodel");

/* =================================================
   UNIFIED AUTH MIDDLEWARE (FIXED EXPORT)
================================================= */
const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    // Priority: Authorization header > cookies
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Check blacklist
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token is invalid or already logged out",
      });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtErr) {
      if (jwtErr.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    let user = null;

    // Host check
    user = await hostModel.findById(decoded._id);
    if (user) {
      req.user = {
        id: user._id,
        role: "host",
        email: user.email,
        fullname: user.fullname,
      };
      return next();
    }

    // Administrator check
    user = await administratorModel.findById(decoded._id);
    if (user) {
      req.user = {
        id: user._id,
        role: "administrator",
        email: user.email,
        fullname: user.fullname,
      };
      return next();
    }

    return res.status(401).json({ message: "Unauthorized user" });
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { authMiddleware };
