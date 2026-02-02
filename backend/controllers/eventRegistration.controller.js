const EventRegistration = require("../models/eventRegistration.model");
const Event = require("../models/event.model");
const { sendEventRegistrationConfirmation } = require("../services/email.services");

/* =================================================
   REGISTER FOR EVENT
================================================= */
exports.registerForEvent = async (req, res) => {
  try {
    const { name, age, email, instituteName, eventId } = req.body;

    // Validate required fields
    if (!name || !age || !email || !instituteName || !eventId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      email: email.toLowerCase(),
      eventId,
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }

    // Create registration
    const registration = new EventRegistration({
      name: name.trim(),
      age: parseInt(age),
      email: email.toLowerCase().trim(),
      instituteName: instituteName.trim(),
      eventId,
    });

    await registration.save();

    // Send confirmation email
    try {
      await sendEventRegistrationConfirmation(
        email,
        name,
        event.eventName || event.title,
        event.eventDate,
        event.eventTime,
        event.description
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
      success: true,
      message: "Successfully registered for the event! Check your email for confirmation.",
      registration: {
        id: registration._id,
        name: registration.name,
        email: registration.email,
        eventId: registration.eventId,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =================================================
   CHECK REGISTRATION STATUS
================================================= */
exports.checkRegistration = async (req, res) => {
  try {
    const { email, eventId } = req.query;

    if (!email || !eventId) {
      return res.status(400).json({
        success: false,
        message: "Email and eventId are required",
      });
    }

    const registration = await EventRegistration.findOne({
      email: email.toLowerCase(),
      eventId,
    });

    res.json({
      success: true,
      isRegistered: !!registration,
    });
  } catch (error) {
    console.error("Check registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =================================================
   GET EVENT REGISTRATIONS (ADMIN)
================================================= */
exports.getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await EventRegistration.find({ eventId })
      .populate("eventId", "eventName title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      registrations,
    });
  } catch (error) {
    console.error("Get registrations error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};