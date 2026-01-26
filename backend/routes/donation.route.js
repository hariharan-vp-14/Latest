const express = require('express');
const {
  createDonation,
  getDonationStats,
  getAllDonations,
} = require('../controllers/donation.controller');

const router = express.Router();

/**
 * @route   POST /api/donations
 * @desc    Create a donation record
 * @access  Public
 */
router.post('/', createDonation);

/**
 * @route   GET /api/donations/stats
 * @desc    Get donation statistics
 * @access  Public
 */
router.get('/stats', getDonationStats);

/**
 * @route   GET /api/donations
 * @desc    Get all donations (admin only)
 * @access  Private
 */
router.get('/', getAllDonations);

module.exports = router;
