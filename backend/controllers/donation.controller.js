const Donation = require('../models/donation.model');

/**
 * Create a donation record for UPI
 */
const createDonation = async (req, res) => {
  try {
    const { amount, donorName, donorEmail, donorPhone, notes } = req.body;

    // Create donation record
    const donation = new Donation({
      amount: amount || 0,
      currency: 'INR',
      donor: {
        name: donorName || 'Anonymous',
        email: donorEmail,
        phone: donorPhone,
      },
      paymentMethod: 'upi',
      status: 'completed',
      notes: notes,
      transactionId: `UPI_${Date.now()}`,
    });

    const savedDonation = await donation.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you for your donation!',
      donation: savedDonation,
    });
  } catch (error) {
    console.error('Create donation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process donation',
      error: error.message,
    });
  }
};

/**
 * Get donation statistics
 */
const getDonationStats = async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 },
          avgDonation: { $avg: '$amount' },
        },
      },
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalAmount: 0,
      totalDonations: 0,
      avgDonation: 0,
    };

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch donation statistics',
      error: error.message,
    });
  }
};

/**
 * Get all donations (admin only)
 */
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 }).limit(100);

    return res.status(200).json({
      success: true,
      donations: donations,
    });
  } catch (error) {
    console.error('Get donations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
      error: error.message,
    });
  }
};
module.exports = {
  createDonation,
  getDonationStats,
  getAllDonations,
};