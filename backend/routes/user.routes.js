const express = require("express");
const userController = require("../controllers/user.controller");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/* ================= REGISTER USER ================= */
router.post(
  "/register",
  [
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email format"),

    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),

    body("fullname.lastname")
      .notEmpty()
      .withMessage("Last name is required"),

    body("age")
      .isNumeric()
      .notEmpty()
      .withMessage("Age is required and must be a number"),

    body("educationLevel")
      .notEmpty()
      .withMessage("Education level is required"),

    body("institution")
      .notEmpty()
      .withMessage("Institution name is required"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),

    body("confirmPassword")
      .isLength({ min: 8 })
      .withMessage("Confirm password must be at least 8 characters long"),

    body("disabilityType").optional(),
  ],
  userController.registerUser
);

/* ================= LOGIN USER ================= */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  userController.loginUser
);

/* ================= 🔐 FORGOT PASSWORD (USER) ================= */
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address"),
  ],
  userController.forgotPassword
);

/* ================= 🔐 RESET PASSWORD (USER) ================= */
router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),

    body("confirmPassword")
      .isLength({ min: 8 })
      .withMessage("Confirm password must be at least 8 characters long"),
  ],
  userController.resetPassword
);

/* ================= VERIFY EMAIL ================= */
router.get(
  "/verify/:token",
  userController.verifyEmail
);

/* ================= USER PROFILE ================= */
router.get(
  "/profile",
  authMiddleware,
  userController.getUserProfile
);

/* ================= LOGOUT USER ================= */
router.get(
  "/logout",
  authMiddleware,
  userController.logoutUser
);

module.exports = router;
