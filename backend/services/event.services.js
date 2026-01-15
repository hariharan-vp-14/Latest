const Event = require("../models/event.model");

/* =================================================
   CREATE EVENT (HOST)
================================================= */
module.exports.createEvent = async (data) => {
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
  adminId
) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid approval status");
  }

  const event = await Event.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  event.approvalStatus = status;
  event.approvedBy = adminId;
  event.approvedAt = new Date();

  await event.save();
  return event;
};
