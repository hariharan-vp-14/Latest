const express = require("express");
const hostController = require("../controllers/host.controllers");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

/* ================= REGISTER HOST ================= */
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

    body("fullname.lastname").optional(),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("confirmPassword")
      .isLength({ min: 6 })
      .withMessage("Confirm password must be at least 6 characters long"),

    body("institution").optional(),
    body("address").optional(),
    body("designation").optional(),
    body("contact").optional(),
    body("totalNumberPhysical")
      .optional()
      .isNumeric()
      .withMessage("Total number physical must be a number"),
  ],
  hostController.registerHost
);

/* ================= LOGIN HOST ================= */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  hostController.loginHost
);

/* ================= 🔐 FORGOT PASSWORD (HOST) ================= */
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address"),
  ],
  hostController.forgotPassword
);

/* ================= 🔐 RESET PASSWORD (HOST) ================= */
router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("confirmPassword")
      .isLength({ min: 6 })
      .withMessage("Confirm password must be at least 6 characters long"),
  ],
  hostController.resetPassword
);

/* ================= VERIFY EMAIL ================= */
router.get(
  "/verify/:token",
  hostController.verifyEmail
);

/* ================= HOST PROFILE ================= */
router.get(
  "/profile",
  authMiddleware,
  hostController.getHostProfile
);

/* ================= LOGOUT HOST ================= */
router.get(
  "/logout",
  authMiddleware,
  hostController.logoutHost
);

module.exports = router;
