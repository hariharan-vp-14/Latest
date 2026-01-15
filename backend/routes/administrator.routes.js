const express = require("express");
const { body } = require("express-validator");

const administratorController = require("../controllers/administrator.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

/* =================================================
   REGISTER ADMINISTRATOR
================================================= */
router.post(
  "/register",
  [
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),

    body("fullname.lastname").optional(),

    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email address"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("confirmPassword")
      .isLength({ min: 6 })
      .withMessage("Confirm password must be at least 6 characters long"),
  ],
  administratorController.registerAdministrator
);

/* =================================================
   LOGIN ADMINISTRATOR
================================================= */
router.post(
  "/login",
  [
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  administratorController.loginAdministrator
);

/* =================================================
   🔐 FORGOT PASSWORD (ADMIN)
================================================= */
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address"),
  ],
  administratorController.forgotPassword
);

/* =================================================
   🔐 RESET PASSWORD (ADMIN)
================================================= */
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
  administratorController.resetPassword
);

/* =================================================
   VERIFY EMAIL
================================================= */
router.get("/verify/:token", administratorController.verifyEmail);

/* =================================================
   ADMIN PROFILE
================================================= */
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("administrator"),
  administratorController.getAdministratorProfile
);

/* =================================================
   ADMIN DASHBOARD STATS
================================================= */
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("administrator"),
  administratorController.getDashboardStats
);

/* =================================================
   LOGOUT ADMINISTRATOR
================================================= */
router.get(
  "/logout",
  authMiddleware,
  roleMiddleware("administrator"),
  administratorController.logoutAdministrator
);

module.exports = router;
