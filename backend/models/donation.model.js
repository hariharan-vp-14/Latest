const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: false,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    donor: {
      name: {
        type: String,
        default: 'Anonymous',
      },
      email: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      default: 'upi',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'confirmed'],
      default: 'pending',
    },
    transactionId: String,
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
