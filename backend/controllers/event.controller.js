const eventService = require("../services/event.services");

/* =================================================
   HOST → CREATE EVENT
================================================= */
module.exports.createEvent = async (req, res) => {
  try {
    const {
      eventName,
      description,
      eventDate,
      eventTime,
      meetingLink,
      category,
      capacity
    } = req.body;

    const hostId = req.user.id;

    const event = await eventService.createEvent({
      eventName,
      description,
      eventDate,
      eventTime,
      meetingLink,
      category,
      capacity,
      createdBy: hostId
    });

    res.status(201).json({
      message: "Event created successfully and sent for approval",
      event
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =================================================
   PUBLIC → GET APPROVED EVENTS
================================================= */
module.exports.getApprovedEvents = async (req, res) => {
  try {
    const events = await eventService.getApprovedEvents();
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================================================
   PUBLIC → GET EVENT BY ID
================================================= */
module.exports.getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.eventId);
    res.status(200).json({ event });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* =================================================
   HOST → UPDATE EVENT (ONLY PENDING)
================================================= */
module.exports.updateEvent = async (req, res) => {
  try {
    const event = await eventService.updateEvent(
      req.params.eventId,
      req.user.id,
      req.body
    );

    res.status(200).json({
      message: "Event updated successfully",
      event
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =================================================
   HOST → DELETE EVENT (ONLY PENDING)
================================================= */
module.exports.deleteEvent = async (req, res) => {
  try {
    await eventService.deleteEvent(req.params.eventId, req.user.id);

    res.status(200).json({
      message: "Event deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =================================================
   HOST → GET HOST'S EVENTS
================================================= */
module.exports.getHostEvents = async (req, res) => {
  try {
    const hostId = req.user.id;
    const events = await eventService.getHostEvents(hostId);
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================================================
   ADMIN → GET PENDING EVENTS
================================================= */
module.exports.getPendingEvents = async (req, res) => {
  try {
    const events = await eventService.getPendingEvents();
    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =================================================
   ADMIN → APPROVE / REJECT EVENT
================================================= */
module.exports.updateEventApprovalStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const event = await eventService.updateEventApprovalStatus(
      req.params.eventId,
      status,
      req.user.id,
      rejectionReason || null
    );

    res.status(200).json({
      message: `Event ${status} successfully`,
      event
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =================================================
   PUBLIC → REGISTER FOR EVENT
================================================= */
module.exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const result = await eventService.registerForEvent(eventId, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
