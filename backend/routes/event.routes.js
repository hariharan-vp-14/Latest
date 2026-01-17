const express = require("express");
const { body } = require("express-validator");

const eventController = require("../controllers/event.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

/* =================================================
   HOST → CREATE EVENT
================================================= */
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("host"),
  [
    body("eventName")
      .isLength({ min: 3 })
      .withMessage("Event name must be at least 3 characters long"),

    body("description")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long"),

    body("eventDate")
      .isISO8601()
      .withMessage("Invalid date format"),

    body("eventTime")
      .notEmpty()
      .withMessage("Event time is required"),

    body("meetingLink")
      .isURL()
      .withMessage("Valid Zoom / Google Meet link is required"),

    body("category")
      .isIn(["tech", "creative", "education", "career"])
      .withMessage("Invalid category"),

    body("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
  ],
  eventController.createEvent
);

/* =================================================
   PUBLIC → GET APPROVED EVENTS
================================================= */
router.get("/", eventController.getApprovedEvents);

/* =================================================
   ADMIN → GET PENDING EVENTS
================================================= */
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware("administrator"),
  eventController.getPendingEvents
);

/* =================================================
   PUBLIC → GET EVENT BY ID
================================================= */
router.get("/:eventId", eventController.getEventById);
router.put(
  "/:eventId",
  authMiddleware,
  roleMiddleware("host"),
  [
    body("eventName").optional().isLength({ min: 3 }),
    body("description").optional().isLength({ min: 10 }),
    body("eventDate").optional().isISO8601(),
    body("eventTime").optional().notEmpty(),
    body("meetingLink").optional().isURL(),
    body("category")
      .optional()
      .isIn(["tech", "creative", "education", "career"]),
    body("capacity").optional().isInt({ min: 1 }),
  ],
  eventController.updateEvent
);

/* =================================================
   HOST → DELETE EVENT (ONLY PENDING)
================================================= */
router.delete(
  "/:eventId",
  authMiddleware,
  roleMiddleware("host"),
  eventController.deleteEvent
);
/* =================================================
   ADMIN → APPROVE / REJECT EVENT
================================================= */
router.put(
  "/:eventId/status",
  authMiddleware,
  roleMiddleware("administrator"),
  [
    body("status")
      .isIn(["approved", "rejected"])
      .withMessage("Status must be approved or rejected"),
  ],
  eventController.updateEventApprovalStatus
);

module.exports = router;
