const Newsletter = require('../models/newsletter.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure email transporter (will be updated with your credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password',
  },
});

// Subscribe to newsletter
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Check if already subscribed
    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'This email is already subscribed' });
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // Create new subscriber
    const newSubscriber = new Newsletter({
      email,
      confirmationToken,
      status: 'pending',
    });

    await newSubscriber.save();

    // Send confirmation email
    const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/newsletter/confirm/${confirmationToken}`;

    const mailOptions = {
      from: `"TalentConnect Pro" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Confirm Your Newsletter Subscription - TalentConnect Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to TalentConnect Pro!</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Empowering students with disabilities</p>
          </div>

          <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Confirm Your Email Subscription</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin: 15px 0;">
              Thank you for subscribing to TalentConnect Pro! We're excited to share:
            </p>

            <ul style="color: #4b5563; line-height: 1.8; margin: 15px 0; padding-left: 20px;">
              <li>✅ Latest events and conferences</li>
              <li>✅ Accessibility tips and resources</li>
              <li>✅ Success stories from our community</li>
              <li>✅ Platform updates and features</li>
              <li>✅ Special offers and early access</li>
            </ul>

            <p style="color: #4b5563; margin: 20px 0;">
              To complete your subscription, please confirm your email by clicking the button below:
            </p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmationUrl}" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                Confirm Email Address
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
              Or copy and paste this link in your browser:<br>
              <code style="background: #f3f4f6; padding: 5px 10px; border-radius: 4px; word-break: break-all;">${confirmationUrl}</code>
            </p>

            <p style="color: #9ca3af; font-size: 12px; margin-top: 15px;">
              This link will expire in 24 hours.
            </p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">© 2026 TalentConnect Pro. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">Empowering accessibility in professional development</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Subscription successful! Please check your email to confirm.',
      email: email,
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      message: 'Error subscribing to newsletter',
      error: error.message,
    });
  }
};

// Confirm subscription
exports.confirmNewsletter = async (req, res) => {
  try {
    const { token } = req.params;

    const subscriber = await Newsletter.findOne({
      confirmationToken: token,
      status: 'pending',
    });

    if (!subscriber) {
      return res.status(400).json({ message: 'Invalid or expired confirmation token' });
    }

    // Update subscriber status
    subscriber.status = 'confirmed';
    subscriber.confirmationToken = null;
    subscriber.confirmedAt = Date.now();
    await subscriber.save();

    res.status(200).json({
      message: 'Email confirmed successfully! You will now receive newsletter updates.',
    });
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(500).json({
      message: 'Error confirming email',
      error: error.message,
    });
  }
};

// Unsubscribe
exports.unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ message: 'Email not found' });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = Date.now();
    await subscriber.save();

    res.status(200).json({ message: 'You have been unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      message: 'Error unsubscribing',
      error: error.message,
    });
  }
};

// Get newsletter stats (admin)
exports.getNewsletterStats = async (req, res) => {
  try {
    const total = await Newsletter.countDocuments();
    const confirmed = await Newsletter.countDocuments({ status: 'confirmed' });
    const pending = await Newsletter.countDocuments({ status: 'pending' });
    const unsubscribed = await Newsletter.countDocuments({ status: 'unsubscribed' });

    res.status(200).json({
      total,
      confirmed,
      pending,
      unsubscribed,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      message: 'Error fetching newsletter stats',
      error: error.message,
    });
  }
};

// Get all subscribers (admin)
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().select('email status confirmedAt subscribedAt').sort({ subscribedAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    res.status(500).json({
      message: 'Error fetching subscribers',
      error: error.message,
    });
  }
};
