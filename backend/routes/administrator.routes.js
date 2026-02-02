const express = require("express");
const { body } = require("express-validator");

const administratorController = require("../controllers/administrator.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
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
   REFRESH TOKEN (ADMIN)
================================================= */
router.post("/refresh-token", administratorController.refreshAccessToken);

/* =================================================
   🔐 FORGOT PASSWORD (ADMIN)
================================================= */
const { validationResult } = require("express-validator");
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
  administratorController.resetPassword
);

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
   UPDATE ADMIN PROFILE
================================================= */
router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("administrator"),
  administratorController.updateAdministratorProfile
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
