const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC EVENT INFORMATION
    ========================== */

    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    eventTime: {
      type: String,
      required: true,
    },

    /* =========================
       MEETING LINK (ZOOM / GMEET)
    ========================== */

    meetingLink: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^https?:\/\/.+/,
        "Meeting link must be a valid URL (Zoom / Google Meet)"
      ]
    },

    /* =========================
       EVENT DETAILS
    ========================== */

    category: {
      type: String,
      enum: ["tech", "creative", "education", "career"],
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    registeredCount: {
      type: Number,
      default: 0,
    },

    /* =========================
       APPROVAL & STATUS FLOW
    ========================== */

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    eventStatus: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },

    /* =========================
       RELATIONSHIPS
    ========================== */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Administrator",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
