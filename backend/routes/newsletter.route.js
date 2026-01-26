const express = require('express');
const router = express.Router();
const {
  subscribeNewsletter,
  confirmNewsletter,
  unsubscribeNewsletter,
  getNewsletterStats,
  getAllSubscribers,
} = require('../controllers/newsletter.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

const adminMiddleware = roleMiddleware('admin');

// Public routes
router.post('/subscribe', subscribeNewsletter);
router.post('/confirm/:token', confirmNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Admin routes
router.get('/stats', authMiddleware, adminMiddleware, getNewsletterStats);
router.get('/subscribers', authMiddleware, adminMiddleware, getAllSubscribers);

module.exports = router;
