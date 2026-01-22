const jwt = require("jsonwebtoken");

/* =================================================
   ENVIRONMENT CHECK
================================================= */
if (!process.env.JWT_SECRET) {
  console.error("❌ CRITICAL: JWT_SECRET is not defined in .env");
} else {
  console.log("✅ JWT_SECRET is configured (length:", process.env.JWT_SECRET.length, "chars)");
}

if (!process.env.JWT_REFRESH_SECRET) {
  console.error("❌ CRITICAL: JWT_REFRESH_SECRET is not defined in .env");
} else {
  console.log(
    "✅ JWT_REFRESH_SECRET is configured (length:",
    process.env.JWT_REFRESH_SECRET.length,
    "chars)"
  );
}

/* =================================================
   ACCESS TOKEN
================================================= */
const generateAccessToken = (payload) => {
  // ✅ Enforce consistent role casing
  const safePayload = {
    ...payload,
    role: payload.role?.toLowerCase()
  };

  const token = jwt.sign(safePayload, process.env.JWT_SECRET, {
    expiresIn: "1h" // 1 hour
  });

  return token;
};

/* =================================================
   REFRESH TOKEN
================================================= */
const generateRefreshToken = (payload) => {
  // ✅ Enforce consistent role casing
  const safePayload = {
    ...payload,
    role: payload.role?.toLowerCase()
  };

  const token = jwt.sign(safePayload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d" // 7 days
  });

  return token;
};

/* =================================================
   EXPORTS
================================================= */
module.exports = {
  generateAccessToken,
  generateRefreshToken
};
