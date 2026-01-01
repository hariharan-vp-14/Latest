const express = require("express");
const userPartController = require("../controllers/userpart.controller");
const { body } = require("express-validator");
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');

router.post(
  "/register",
  [
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),

    body("fullname.lastname")
      .optional(),

    body("email")
      .isEmail()
      .withMessage("Invalid Email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    body("confirmPassword")
      .isLength({ min: 6 })
      .withMessage("Confirm password must be at least 6 characters long"),

    body("eduInfo").optional(),
    body("age").optional().isNumeric().withMessage("Age must be a number"),
    body("institution").optional(),
    body("disabilityType").optional(),
  ],
  userPartController.registerUserParticipant
);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    userPartController.loginUserParticipant
);

router.get(
  '/profile',
  authMiddleware.authUserPart,
  userPartController.getUserParticipantProfile
);

router.get(
  '/logout',
  authMiddleware.authUserPart,
  userPartController.logoutUserParticipant
);

module.exports = router;