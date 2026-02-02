const Newsletter = require('../models/newsletter.model');
const crypto = require('crypto');
const { createTransporter } = require('../services/email.services');

// Subscribe to newsletter
exports.subscribeNewsletter = async (req, res) => {
  console.log('📧 Newsletter subscription request received:', req.body);
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

    // Send confirmation email (don't fail the subscription if email fails)
    try {
      const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/newsletter/confirm/${confirmationToken}`;

      const transporter = await createTransporter();
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
                <li>🔔 Notifications about new accepted events</li>
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
      console.log('Confirmation email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError.message);
      // Don't fail the subscription if email fails
    }

    res.status(201).json({
      message: 'Subscription successful! Please check your email to confirm.',
      email: email,
    });
    console.log('✅ Newsletter subscription successful for:', email);
  } catch (error) {
    console.error('❌ Newsletter subscription error:', error);
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
      message: 'Email confirmed successfully! You will now receive newsletter updates and notifications about new events.',
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

// Notify all confirmed subscribers about new accepted event
exports.notifySubscribersAboutNewEvent = async (eventDetails) => {
  try {
    // Get all confirmed subscribers
    const confirmedSubscribers = await Newsletter.find({ status: 'confirmed' });

    if (confirmedSubscribers.length === 0) {
      console.log('No confirmed subscribers to notify about new event');
      return;
    }

    const transporter = await createTransporter();

    // Send email to each confirmed subscriber
    const emailPromises = confirmedSubscribers.map(async (subscriber) => {
      try {
        const mailOptions = {
          from: `"TalentConnect Pro" <${process.env.EMAIL_USER}>`,
          to: subscriber.email,
          subject: `🎉 New Event Available: ${eventDetails.title} - TalentConnect Pro`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
              <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 24px;">New Event Alert!</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px;">TalentConnect Pro</p>
              </div>

              <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #1f2937; margin-top: 0; text-align: center;">${eventDetails.title}</h2>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">Event Details:</h3>
                  <p style="margin: 10px 0;"><strong>📅 Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()}</p>
                  <p style="margin: 10px 0;"><strong>📍 Location:</strong> ${eventDetails.location || 'TBD'}</p>
                  <p style="margin: 10px 0;"><strong>👥 Host:</strong> ${eventDetails.hostName || 'TalentConnect Pro'}</p>
                  ${eventDetails.description ? `<p style="margin: 10px 0;"><strong>📝 Description:</strong> ${eventDetails.description}</p>` : ''}
                </div>

                <p style="color: #4b5563; line-height: 1.6; margin: 20px 0;">
                  We're excited to announce this new event opportunity! As a valued member of our community, you're among the first to know about this upcoming event.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/events" style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
                    View Event Details
                  </a>
                </div>

                <p style="color: #4b5563; margin: 20px 0;">
                  Stay connected with TalentConnect Pro for more opportunities and updates!
                </p>
              </div>

              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                <p style="margin: 0;">© 2026 TalentConnect Pro. All rights reserved.</p>
                <p style="margin: 5px 0 0 0;">Empowering accessibility in professional development</p>
                <p style="margin: 10px 0 0 0;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/newsletter/unsubscribe?email=${subscriber.email}" style="color: #6b7280; text-decoration: underline;">Unsubscribe from newsletter</a>
                </p>
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Event notification sent to: ${subscriber.email}`);
      } catch (emailError) {
        console.error(`Failed to send event notification to ${subscriber.email}:`, emailError.message);
      }
    });

    await Promise.all(emailPromises);
    console.log(`Event notifications sent to ${confirmedSubscribers.length} subscribers`);

  } catch (error) {
    console.error('Error sending event notifications:', error);
  }
};
