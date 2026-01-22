const express = require("express");
const hostController = require("../controllers/host.controllers");
const { body, validationResult } = require("express-validator");
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
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),

    body("institution").optional(),
    body("address").optional(),
    body("designation").optional(),
    body("contact").optional(),

    body("totalNumberPhysical")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Total number physical must be a number"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
  hostController.loginHost
);

/* ================= FORGOT PASSWORD ================= */
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Invalid email")],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
  hostController.forgotPassword
);

/* ================= RESET PASSWORD ================= */
router.post(
  "/reset-password/:token",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
  hostController.resetPassword
);

/* ================= PROFILE ================= */
router.get("/profile", authMiddleware, hostController.getHostProfile);

/* ================= UPDATE PROFILE ================= */
router.put("/profile", authMiddleware, hostController.updateHostProfile);

/* ================= LOGOUT ================= */
router.get("/logout", authMiddleware, hostController.logoutHost);

/* ================= REFRESH TOKEN ================= */
router.post("/refresh-token", hostController.refreshAccessToken);

module.exports = router;
