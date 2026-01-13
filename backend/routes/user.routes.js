const express = require("express");
const userController = require("../controllers/user.controllers");
const { body } = require("express-validator");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

/* ================= REGISTER ================= */
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
  userController.registerUser
);

/* ================= LOGIN ================= */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginUser
);

/* ================= VERIFY EMAIL ================= */
router.get(
  "/verify/:token",
  userController.verifyEmail
);

/* ================= PROFILE ================= */
router.get(
  "/profile",
  authMiddleware.authUser,
  userController.getUserProfile
);

/* ================= LOGOUT ================= */
router.get(
  "/logout",
  authMiddleware.authUser,
  userController.logoutUser
);

module.exports = router;
