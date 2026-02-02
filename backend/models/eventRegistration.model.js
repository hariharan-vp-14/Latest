const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    instituteName: {
      type: String,
      required: true,
      trim: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate registrations per event
eventRegistrationSchema.index({ email: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);