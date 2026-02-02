const nodemailer = require("nodemailer");

/* =================================================
   CREATE TRANSPORTER
================================================= */
const createTransporter = async () => {
  // Production: Gmail
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Development fallback: Ethereal
  const testAccount = await nodemailer.createTestAccount();

  console.warn("⚠️ EMAIL_USER / EMAIL_PASS not set — using Ethereal test email");

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

/* =================================================
   EVENT APPROVAL / REJECTION EMAIL
================================================= */
exports.sendEventApprovalMail = async (to, eventName, status) => {
  const transporter = await createTransporter();

  const isApproved = status === "approved";

  const subject = isApproved
    ? "🎉 Your Event Has Been Approved - TalentConnect Pro"
    : "❌ Your Event Has Been Rejected - TalentConnect Pro";

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>TalentConnect Pro</h2>
      <p>Hello,</p>
      <p>
        Your event <strong>${eventName}</strong> has been
        <strong style="color:${isApproved ? "green" : "red"};">
          ${status.toUpperCase()}
        </strong>.
      </p>
      ${
        isApproved
          ? "<p>Your event is now visible to the public.</p>"
          : "<p>You may edit and resubmit the event if required.</p>"
      }
      <br />
      <p>Regards,<br/>TalentConnect Pro Team</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"TalentConnect Pro" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
    to,
    subject,
    html
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("📧 Event email preview URL:", previewUrl);
  }
};

/* =================================================
   🔐 FORGOT PASSWORD EMAIL (HOST & ADMIN)
================================================= */
exports.sendPasswordResetMail = async (to, resetLink, role) => {
  const transporter = await createTransporter();

  const subject = `Reset Your Password - TalentConnect Pro (${role})`;

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>TalentConnect Pro</h2>
      <p>You requested to reset your <strong>${role}</strong> account password.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p><b>This link is valid for 15 minutes.</b></p>
      <p>If you did not request this, please ignore this email.</p>
      <br />
      <p>Regards,<br/>TalentConnect Pro Team</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"TalentConnect Pro" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
    to,
    subject,
    html
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("📧 Password reset email preview URL:", previewUrl);
  }
};

/* =================================================
   LOGIN NOTIFICATION EMAIL
================================================= */
exports.sendLoginNotificationMail = async (to, role) => {
  const transporter = await createTransporter();

  const subject = `Login Notification - TalentConnect Pro`;

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>TalentConnect Pro</h2>
      <p>Hello,</p>
      <p>You have successfully logged in as a <strong>${role}</strong>.</p>
      <p>If this wasn't you, please contact support immediately.</p>
      <br>
      <p>Best regards,<br>TalentConnect Pro Team</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `"TalentConnect Pro" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
    to,
    subject,
    html
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log("📧 Login notification email preview URL:", previewUrl);
  }
};

/* =================================================
   WELCOME EMAIL (USER, ADMIN, HOST)
================================================= */
exports.sendWelcomeEmail = async (to, role = "User") => {
  try {
    const transporter = await createTransporter();

    const subject = `Welcome to TalentConnect Pro - ${role} Account Created`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to TalentConnect Pro! 🎉</h1>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #333; margin-bottom: 10px;">Hello,</p>
          
          <p style="font-size: 14px; color: #666; margin-bottom: 15px;">
            Thank you for creating your <strong>${role}</strong> account on TalentConnect Pro. 
            We're excited to have you on board!
          </p>
          
          <div style="background: white; border: 2px solid #e5e7eb; border-left: 4px solid #2563eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">What's Next?</h3>
            
            ${role === 'User' ? `
              <ul style="color: #666; font-size: 14px; padding-left: 20px;">
                <li>Complete your profile information</li>
                <li>Explore and register for events</li>
                <li>Connect with other participants</li>
              </ul>
            ` : role === 'Administrator' ? `
              <ul style="color: #666; font-size: 14px; padding-left: 20px;">
                <li>Review pending events</li>
                <li>Approve or reject event submissions</li>
                <li>Monitor platform activity</li>
              </ul>
            ` : `
              <ul style="color: #666; font-size: 14px; padding-left: 20px;">
                <li>Complete your organization profile</li>
                <li>Create and submit your first event</li>
                <li>Manage event registrations</li>
              </ul>
            `}
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #2563eb; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Need help?</strong> Check out our support center or contact our team for assistance.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px;">
          <p style="margin: 0;">TalentConnect Pro © ${new Date().getFullYear()}</p>
          <p style="margin: 5px 0 0 0; font-size: 11px;">This is an automated email. Please do not reply directly.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"TalentConnect Pro" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to,
      subject,
      html
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📧 Welcome email (${role}) preview URL:`, previewUrl);
    }
    return true;
  } catch (err) {
    console.error(`❌ Failed to send welcome email (${role}):`, err.message);
    return false;
  }
};

/* =================================================
   HOST NOTIFICATION: EVENT APPROVED/REJECTED
================================================= */
exports.sendEventDecisionNotification = async (hostEmail, hostName, eventName, status, rejectionReason = null, eventDetails = null) => {
  const transporter = await createTransporter();

  const isApproved = status === 'approved';
  const subject = isApproved 
    ? "✅ Your Event Has Been Approved - TalentConnect Pro"
    : "❌ Your Event Has Been Rejected - TalentConnect Pro";

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const eventDetailsHTML = eventDetails ? `
    <div style="background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1f2937;">📋 Event Details</h3>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 0; color: #666; width: 30%;"><strong>Title:</strong></td>
          <td style="padding: 12px 0; color: #1f2937;">${eventDetails.eventName || eventName}</td>
        </tr>
        ${eventDetails.description ? `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 0; color: #666; vertical-align: top;"><strong>Description:</strong></td>
          <td style="padding: 12px 0; color: #1f2937;">${eventDetails.description}</td>
        </tr>
        ` : ''}
        ${eventDetails.eventDate ? `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 0; color: #666;"><strong>📅 Date:</strong></td>
          <td style="padding: 12px 0; color: #1f2937;">${formatDate(eventDetails.eventDate)}</td>
        </tr>
        ` : ''}
        ${eventDetails.eventTime ? `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 0; color: #666;"><strong>⏰ Time:</strong></td>
          <td style="padding: 12px 0; color: #1f2937;">${eventDetails.eventTime}</td>
        </tr>
        ` : ''}
        ${eventDetails.capacity ? `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 0; color: #666;"><strong>👥 Capacity:</strong></td>
          <td style="padding: 12px 0; color: #1f2937;">${eventDetails.capacity} participants</td>
        </tr>
        ` : ''}
        ${eventDetails.category ? `
        <tr style="border-bottom: 1px solid #f3f4f6;">
          <td style="padding: 12px 0; color: #666;"><strong>🏷️ Category:</strong></td>
          <td style="padding: 12px 0; color: #1f2937; text-transform: capitalize;">${eventDetails.category}</td>
        </tr>
        ` : ''}
        ${eventDetails.meetingLink ? `
        <tr>
          <td style="padding: 12px 0; color: #666;"><strong>🔗 Meeting Link:</strong></td>
          <td style="padding: 12px 0;"><a href="${eventDetails.meetingLink}" style="color: #3b82f6; text-decoration: none; word-break: break-all;">${eventDetails.meetingLink}</a></td>
        </tr>
        ` : ''}
      </table>
    </div>
  ` : '';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, ${isApproved ? '#10b981' : '#ef4444'} 0%, ${isApproved ? '#059669' : '#dc2626'} 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">${isApproved ? '✅ Event Approved' : '❌ Event Rejected'}</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb;">
        <p style="font-size: 16px; margin-bottom: 10px;">Hello ${hostName},</p>
        
        ${isApproved 
          ? `<p style="font-size: 14px; color: #059669; font-weight: bold;">Great news! Your event has been approved and is now live!</p>
             <p style="font-size: 14px; color: #666;">Your event "<strong>${eventName}</strong>" is now visible to all users and they can register for it.</p>`
          : `<p style="font-size: 14px; color: #dc2626; font-weight: bold;">Unfortunately, your event has been rejected.</p>
             <p style="font-size: 14px; color: #666;">Your event "<strong>${eventName}</strong>" was not approved at this time.</p>
             ${rejectionReason ? `<div style="background: #fee2e2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; padding: 15px; border-radius: 4px; margin: 15px 0;">
               <p style="margin: 0; color: #7f1d1d; font-size: 13px;"><strong>Reason:</strong> ${rejectionReason}</p>
             </div>` : ''}`
        }
        
        ${eventDetailsHTML}
        
        <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            ${isApproved 
              ? '<strong>Next steps:</strong> Monitor registrations and prepare for your event.'
              : '<strong>Next steps:</strong> You can edit and resubmit your event for review.'
            }
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/host-dashboard" 
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
      </div>
      
      <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px;">
        <p style="margin: 0;">TalentConnect Pro © ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"TalentConnect Pro" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to: hostEmail,
      subject,
      html
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📧 Event ${status} notification preview URL:`, previewUrl);
    }
    return true;
  } catch (err) {
    console.error(`❌ Failed to send event ${status} notification:`, err);
    return false;
  }
};
exports.sendAdminNewEventNotification = async (adminEmail, eventName, hostName, eventDetails) => {
  const transporter = await createTransporter();

  const subject = "🎯 New Event Awaiting Approval - TalentConnect Pro";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">🎯 New Event Awaiting Approval</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb;">
        <p style="font-size: 16px; margin-bottom: 20px;">Hello Admin,</p>
        
        <p style="font-size: 14px; color: #666;">A new event has been submitted and is waiting for your review:</p>
        
        <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1f2937; margin-top: 0;">${eventName}</h2>
          
          <p style="margin: 8px 0;"><strong>Submitted by:</strong> ${hostName}</p>
          <p style="margin: 8px 0;"><strong>Category:</strong> ${eventDetails.category || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date(eventDetails.eventDate).toLocaleDateString()}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${eventDetails.eventTime || 'N/A'}</p>
          <p style="margin: 8px 0;"><strong>Capacity:</strong> ${eventDetails.capacity || 'N/A'} participants</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;">
          
          <p style="color: #666; font-size: 13px; margin: 8px 0;"><strong>Description:</strong></p>
          <p style="color: #666; font-size: 13px; margin: 8px 0;">${eventDetails.description || 'N/A'}</p>
        </div>
        
        <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; color: #1e40af; font-size: 14px;">
            <strong>Action Required:</strong> Please review this event and approve or reject it within 24 hours.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/events" 
             style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Review Events
          </a>
        </div>
      </div>
      
      <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px;">
        <p style="margin: 0;">TalentConnect Pro © ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"TalentConnect Pro" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to: adminEmail,
      subject,
      html
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("📧 Admin notification email preview URL:", previewUrl);
    }
    return true;
  } catch (err) {
    console.error("❌ Failed to send admin notification email:", err);
    return false;
  }
};

/* =================================================
   EVENT REGISTRATION CONFIRMATION EMAIL
================================================= */
exports.sendEventRegistrationConfirmation = async (to, name, eventName, eventDate, eventTime, eventDescription) => {
  const transporter = await createTransporter();

  const subject = `🎉 Registration Confirmed - ${eventName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">TalentConnect Pro</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Event Registration Confirmation</p>
      </div>
      
      <div style="background: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="color: #333; margin-bottom: 20px;">Welcome ${name}!</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #667eea; margin: 0 0 15px 0;">Your registration for "${eventName}" has been confirmed!</h3>
          
          <div style="margin: 15px 0;">
            <strong>Event Details:</strong><br>
            <span style="color: #666;">Date: ${eventDate ? new Date(eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}</span><br>
            <span style="color: #666;">Time: ${eventTime || 'TBD'}</span>
          </div>
          
          <div style="margin: 15px 0;">
            <strong>Description:</strong><br>
            <span style="color: #666;">${eventDescription || 'Join us for an exciting event!'}</span>
          </div>
        </div>
        
        <div style="background: #e8f5e8; border: 1px solid #4caf50; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #2e7d32; margin: 0; font-weight: bold;">
            🎯 Best of luck with your participation! We're excited to see your talents shine.
          </p>
        </div>
        
        <p style="color: #666; line-height: 1.6;">
          You will receive the meeting link and any additional updates via email closer to the event date.
        </p>
        
        <p style="color: #666; line-height: 1.6;">
          If you have any questions, feel free to reach out to our support team.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'https://talentconnectpro.com'}/events" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            View All Events
          </a>
        </div>
      </div>
      
      <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px;">
        <p style="margin: 0;">TalentConnect Pro © ${new Date().getFullYear()}</p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"TalentConnect Pro" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to,
      subject,
      html
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("📧 Registration confirmation email preview URL:", previewUrl);
    }
    return true;
  } catch (err) {
    console.error("❌ Failed to send registration confirmation email:", err);
    return false;
  }
};
