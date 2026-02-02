const Event = require("../models/event.model");
const Registration = require("../models/registration.model");
const Host = require("../models/hostmodel"); // Ensure Host model is loaded
const User = require("../models/user.model");
const { sendAdminNewEventNotification, sendEventDecisionNotification, sendEventRegistrationConfirmation } = require("./email.services");

/* =================================================
   CREATE EVENT (HOST)
================================================= */
module.exports.createEvent = async (data, hostData = null) => {
  const {
    eventName,
    description,
    eventDate,
    eventTime,
    meetingLink,
    category,
    capacity,
    createdBy
  } = data;

  if (
    !eventName ||
    !description ||
    !eventDate ||
    !eventTime ||
    !meetingLink ||
    !category ||
    !capacity ||
    !createdBy
  ) {
    throw new Error("All required event fields must be provided");
  }

  const event = await Event.create({
    eventName,
    description,
    eventDate,
    eventTime,
    meetingLink,
    category,
    capacity,
    createdBy
  });

  // Populate host info for email notification
  const populatedEvent = await event.populate("createdBy", "fullname email");

  // Send notification to all admins asynchronously (don't wait for it)
  if (process.env.ADMIN_EMAIL) {
    const hostName = populatedEvent.createdBy?.fullname 
      ? `${populatedEvent.createdBy.fullname.firstname} ${populatedEvent.createdBy.fullname.lastname}`
      : 'Unknown Host';
    
    // Send email in the background without waiting
    sendAdminNewEventNotification(
      process.env.ADMIN_EMAIL,
      eventName,
      hostName,
      {
        category,
        eventDate,
        eventTime,
        capacity,
        description,
      }
    ).catch(err => console.error("Failed to notify admin:", err));
  }

  return event;
};

/* =================================================
   GET ALL APPROVED EVENTS (PUBLIC)
================================================= */
module.exports.getApprovedEvents = async () => {
  return Event.find({ approvalStatus: "approved" })
    .populate("createdBy", "fullname email")
    .sort({ eventDate: 1 });
};

/* =================================================
   GET PENDING EVENTS (ADMIN)
================================================= */
module.exports.getPendingEvents = async () => {
  return Event.find({ approvalStatus: "pending" })
    .populate("createdBy", "fullname email")
    .sort({ createdAt: -1 });
};

/* =================================================
   GET HOST'S EVENTS
================================================= */
module.exports.getHostEvents = async (hostId) => {
  return Event.find({ createdBy: hostId })
    .populate("createdBy", "fullname email")
    .sort({ createdAt: -1 });
};

/* =================================================
   GET EVENT BY ID
================================================= */
module.exports.getEventById = async (eventId) => {
  const event = await Event.findById(eventId).populate(
    "createdBy",
    "fullname email"
  );

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

/* =================================================
   UPDATE EVENT (HOST – BEFORE APPROVAL)
================================================= */
module.exports.updateEvent = async (eventId, hostId, updates) => {
  const event = await Event.findOne({
    _id: eventId,
    createdBy: hostId,
    approvalStatus: "pending"
  });

  if (!event) {
    throw new Error("Event not found or cannot be updated");
  }

  Object.assign(event, updates);
  await event.save();

  return event;
};

/* =================================================
   DELETE EVENT (HOST – BEFORE APPROVAL)
================================================= */
module.exports.deleteEvent = async (eventId, hostId) => {
  const event = await Event.findOneAndDelete({
    _id: eventId,
    createdBy: hostId,
    approvalStatus: "pending"
  });

  if (!event) {
    throw new Error("Event not found or cannot be deleted");
  }

  return event;
};

/* =================================================
   APPROVE / REJECT EVENT (ADMIN)
================================================= */
module.exports.updateEventApprovalStatus = async (
  eventId,
  status,
  adminId,
  rejectionReason = null
) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid approval status");
  }

  const event = await Event.findById(eventId).populate("createdBy", "email fullname");

  if (!event) {
    throw new Error("Event not found");
  }

  event.approvalStatus = status;
  event.approvedBy = adminId;
  event.approvedAt = new Date();
  
  // Save rejection reason if rejecting
  if (status === "rejected" && rejectionReason) {
    event.rejectionReason = rejectionReason;
  }

  await event.save();

  // Send email to host about event decision with full event details
  if (event.createdBy && event.createdBy.email) {
    const hostName = event.createdBy.fullname 
      ? `${event.createdBy.fullname.firstname} ${event.createdBy.fullname.lastname}`
      : 'Host';

    const eventDetails = {
      eventName: event.eventName,
      description: event.description,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      capacity: event.capacity,
      category: event.category,
      meetingLink: event.meetingLink
    };

    await sendEventDecisionNotification(
      event.createdBy.email,
      hostName,
      event.eventName,
      status,
      rejectionReason,
      eventDetails
    ).catch(err => console.error("Failed to notify host:", err));
  }

  return event;
};

/* =================================================
   REGISTER FOR EVENT (PUBLIC)
================================================= */
module.exports.registerForEvent = async (eventId, userId) => {
  // Check if event exists and is approved
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  if (event.approvalStatus !== "approved") {
    throw new Error("Event is not available for registration");
  }

  // Check if event is full
  if (event.registeredCount >= event.capacity) {
    throw new Error("Event is full");
  }

  // Check if user is already registered
  const existingRegistration = await Registration.findOne({
    userId,
    eventId
  });

  if (existingRegistration) {
    throw new Error("Already registered for this event");
  }

  // Create registration
  await Registration.create({
    userId,
    eventId
  });

  // Update registered count
  event.registeredCount += 1;
  await event.save();

  // Send registration confirmation email to user
  try {
    const user = await User.findById(userId).select('fullname email');
    if (user && user.email) {
      const userName = user.fullname ? `${user.fullname.firstname} ${user.fullname.lastname}` : 'User';

      await sendEventRegistrationConfirmation(
        user.email,
        userName,
        event.eventName,
        event.eventDate,
        event.eventTime,
        event.description
      );
      console.log('✅ Event registration confirmation email sent to:', user.email);
    }
  } catch (emailError) {
    console.error('❌ Failed to send registration confirmation email:', emailError.message);
    // Don't fail the registration if email fails
  }

  return { message: "Successfully registered for event" };
};
