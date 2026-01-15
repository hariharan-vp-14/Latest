const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");
const hostModel = require("../models/hostmodel");
const administratorModel = require("../models/administratormodel");

/* =================================================
   UNIFIED AUTH MIDDLEWARE
================================================= */
module.exports = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Check blacklist (logout)
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({
        message: "Token is invalid or already logged out"
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;

    // Check in Host collection
    user = await hostModel.findById(decoded._id);
    if (user) {
      req.user = {
        id: user._id,
        role: "host",
        email: user.email,
        fullname: user.fullname
      };
      return next();
    }

    // Check in Administrator collection
    user = await administratorModel.findById(decoded._id);
    if (user) {
      req.user = {
        id: user._id,
        role: "administrator",
        email: user.email,
        fullname: user.fullname
      };
      return next();
    }

    return res.status(401).json({ message: "Unauthorized user" });

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};
