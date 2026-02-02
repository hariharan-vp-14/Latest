const express = require("express");
const userController = require("../controllers/user.controller");
const { body, validationResult } = require("express-validator");

// ✅ FIX: destructure middleware correctly
const { authMiddleware } = require("../middleware/auth.middleware");

const router = express.Router();

/* ================= REGISTER USER ================= */
router.post(
  "/register",
  [
    body("email").trim().normalizeEmail().isEmail().withMessage("Invalid email format"),
    body("fullname.firstname").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
    body("fullname.lastname").notEmpty().withMessage("Last name is required"),
    body("age").isInt({ min: 1 }).withMessage("Age must be a valid number"),
    body("educationLevel").notEmpty().withMessage("Education level is required"),
    body("institution").notEmpty().withMessage("Institution name is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    body("disabilityType").optional(),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  userController.registerUser
);

/* ================= LOGIN USER ================= */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  userController.loginUser
);

/* ================= REFRESH TOKEN ================= */
router.post("/refresh-token", userController.refreshAccessToken);

/* ================= FORGOT PASSWORD ================= */
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Invalid email")],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  userController.forgotPassword
);

/* ================= RESET PASSWORD ================= */
router.post(
  "/reset-password/:token",
  [
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  userController.resetPassword
);

/* ================= USER PROFILE ================= */
router.get("/profile", authMiddleware, userController.getUserProfile);

/* ================= UPDATE PROFILE ================= */
router.put("/profile", authMiddleware, userController.updateUserProfile);

/* ================= LOGOUT ================= */
router.get("/logout", userController.logoutUser);

module.exports = router;
