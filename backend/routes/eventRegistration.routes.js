const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  checkRegistration,
  getEventRegistrations,
} = require("../controllers/eventRegistration.controller");

/* =================================================
   REGISTER FOR EVENT
================================================= */
router.post("/register", registerForEvent);

/* =================================================
   CHECK REGISTRATION STATUS
================================================= */
router.get("/check", checkRegistration);

/* =================================================
   GET EVENT REGISTRATIONS (ADMIN)
================================================= */
router.get("/:eventId", getEventRegistrations);

module.exports = router;