const nodemailer = require("nodemailer");

/* =================================================
   REUSABLE TRANSPORTER (singleton – created once)
================================================= */
let _transporter = null;

const createTransporter = async () => {
  if (_transporter) return _transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log("✅ Email transporter configured with Gmail:", process.env.EMAIL_USER);
    return _transporter;
  }

  // Development fallback: Ethereal
  const testAccount = await nodemailer.createTestAccount();
  console.warn("⚠️ EMAIL_USER / EMAIL_PASS not set — using Ethereal test email");
  _transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  return _transporter;
};

/* =================================================
   SHARED STYLES / HELPERS
================================================= */
const BRAND = "TalentConnect Pro";
const BRAND_COLOR = "#2563eb";
const YEAR = new Date().getFullYear();

const baseWrapper = (headerBg, headerTitle, bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="max-width:620px;margin:30px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- HEADER -->
    <div style="background:${headerBg};padding:32px 30px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:0.5px;">${headerTitle}</h1>
    </div>
    <!-- BODY -->
    <div style="padding:36px 30px 24px;">
      ${bodyHtml}
    </div>
    <!-- FOOTER -->
    <div style="background:#f9fafb;padding:20px 30px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">&copy; ${YEAR} ${BRAND}. All rights reserved.</p>
      <p style="margin:6px 0 0;font-size:11px;color:#9ca3af;">This is an automated message — please do not reply directly.</p>
    </div>
  </div>
</body>
</html>`;

const btn = (href, label, bg = BRAND_COLOR) =>
  `<div style="text-align:center;margin:28px 0 12px;">
    <a href="${href}" style="display:inline-block;background:${bg};color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">${label}</a>
  </div>`;

const infoRow = (icon, label, value) =>
  value
    ? `<tr>
        <td style="padding:10px 0;color:#6b7280;width:36%;font-size:14px;">${icon} <strong>${label}</strong></td>
        <td style="padding:10px 0;color:#1f2937;font-size:14px;">${value}</td>
      </tr>`
    : "";

const formatDate = (d) => {
  if (!d) return "TBD";
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const frontendUrl = () => process.env.FRONTEND_URL || "http://localhost:5173";

/* =================================================
   1. WELCOME EMAIL (User / Host / Admin signup)
================================================= */
exports.sendWelcomeEmail = async (to, role = "User", name = "") => {
  try {
    const transporter = await createTransporter();

    const roleGuide = {
      User: [
        "Browse and register for exciting events",
        "Receive email reminders for upcoming events",
        "Track your registered events from your dashboard",
        "Connect with talented participants",
      ],
      Host: [
        "Create and submit events for approval",
        "Track your events' approval status",
        "Manage registrations and attendees",
        "Receive email updates when events are approved or rejected",
      ],
      Administrator: [
        "Review and approve/reject submitted events",
        "Monitor platform activity and statistics",
        "Manage hosts and users",
        "Oversee overall platform operations",
      ],
    };

    const items = (roleGuide[role] || roleGuide.User)
      .map((t) => `<li style="padding:6px 0;color:#4b5563;font-size:14px;">${t}</li>`)
      .join("");

    const greeting = name ? `Hello ${name},` : "Hello,";

    const body = `
      <p style="font-size:16px;color:#1f2937;margin:0 0 8px;">${greeting}</p>
      <p style="font-size:15px;color:#4b5563;line-height:1.6;">
        Welcome to <strong>${BRAND}</strong>! Your <strong>${role}</strong> account has been created successfully.
      </p>

      <div style="background:#f0f9ff;border:1px solid #bae6fd;border-left:4px solid ${BRAND_COLOR};border-radius:8px;padding:20px;margin:24px 0;">
        <h3 style="margin:0 0 12px;color:#1e3a5f;font-size:16px;">🚀 Getting Started</h3>
        <ul style="margin:0;padding-left:20px;">${items}</ul>
      </div>

      ${btn(frontendUrl() + "/login", "Go to Dashboard")}
    `;

    const html = baseWrapper(
      `linear-gradient(135deg, ${BRAND_COLOR} 0%, #1d4ed8 100%)`,
      `🎉 Welcome to ${BRAND}!`,
      body
    );

    await transporter.sendMail({
      from: `"${BRAND}" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to,
      subject: `Welcome to ${BRAND} — ${role} Account Created`,
      html,
    });

    console.log(`✅ Welcome email sent to ${to} (${role})`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to send welcome email (${role}):`, err.message);
    return false;
  }
};

/* =================================================
   2. EVENT APPROVAL / REJECTION → HOST
================================================= */
exports.sendEventDecisionNotification = async (
  hostEmail,
  hostName,
  eventName,
  status,
  rejectionReason = null,
  eventDetails = null
) => {
  try {
    const transporter = await createTransporter();
    const isApproved = status === "approved";

    /* ---- event details table ---- */
    let detailsBlock = "";
    if (eventDetails) {
      const rows = [
        infoRow("📌", "Title", eventDetails.eventName || eventName),
        infoRow("📅", "Date", formatDate(eventDetails.eventDate)),
        infoRow("⏰", "Time", eventDetails.eventTime),
        infoRow("🏷️", "Category", eventDetails.category ? eventDetails.category.charAt(0).toUpperCase() + eventDetails.category.slice(1) : null),
        infoRow("👥", "Capacity", eventDetails.capacity ? `${eventDetails.capacity} participants` : null),
        infoRow("🔗", "Meeting Link", eventDetails.meetingLink ? `<a href="${eventDetails.meetingLink}" style="color:${BRAND_COLOR};word-break:break-all;">${eventDetails.meetingLink}</a>` : null),
      ].join("");

      detailsBlock = `
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0;">
          <h3 style="margin:0 0 14px;color:#1f2937;font-size:15px;">📋 Event Details</h3>
          <table style="width:100%;border-collapse:collapse;">${rows}</table>
          ${eventDetails.description ? `<p style="margin:14px 0 0;color:#6b7280;font-size:13px;line-height:1.5;border-top:1px solid #e5e7eb;padding-top:14px;"><strong>Description:</strong> ${eventDetails.description}</p>` : ""}
        </div>`;
    }

    /* ---- rejection reason ---- */
    const reasonBlock =
      !isApproved && rejectionReason
        ? `<div style="background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #ef4444;padding:16px;border-radius:6px;margin:16px 0;">
            <p style="margin:0;color:#991b1b;font-size:14px;"><strong>Reason for rejection:</strong> ${rejectionReason}</p>
          </div>`
        : "";

    const body = `
      <p style="font-size:16px;color:#1f2937;margin:0 0 8px;">Hello ${hostName},</p>

      ${
        isApproved
          ? `<div style="background:#ecfdf5;border-left:4px solid #10b981;padding:16px;border-radius:6px;margin:16px 0;">
              <p style="margin:0;color:#065f46;font-size:15px;font-weight:600;">🎉 Great news! Your event "<strong>${eventName}</strong>" has been approved and is now live.</p>
            </div>
            <p style="font-size:14px;color:#4b5563;line-height:1.6;">Users can now discover and register for your event. You'll be notified as registrations come in.</p>`
          : `<div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px;border-radius:6px;margin:16px 0;">
              <p style="margin:0;color:#991b1b;font-size:15px;font-weight:600;">Your event "<strong>${eventName}</strong>" was not approved at this time.</p>
            </div>
            ${reasonBlock}
            <p style="font-size:14px;color:#4b5563;line-height:1.6;">You may edit and resubmit the event after addressing any feedback.</p>`
      }

      ${detailsBlock}

      <div style="background:#eff6ff;border-left:4px solid ${BRAND_COLOR};padding:14px;border-radius:6px;margin:20px 0;">
        <p style="margin:0;color:#1e40af;font-size:14px;">
          <strong>Next steps:</strong> ${isApproved ? "Monitor registrations and prepare for your event." : "Review the feedback, edit your event, and resubmit for approval."}
        </p>
      </div>

      ${btn(frontendUrl() + "/host-dashboard", "Go to Host Dashboard")}
    `;

    const html = baseWrapper(
      `linear-gradient(135deg, ${isApproved ? "#10b981" : "#ef4444"} 0%, ${isApproved ? "#059669" : "#dc2626"} 100%)`,
      isApproved ? "✅ Event Approved" : "❌ Event Rejected",
      body
    );

    await transporter.sendMail({
      from: `"${BRAND}" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to: hostEmail,
      subject: isApproved
        ? `✅ Your Event "${eventName}" Has Been Approved — ${BRAND}`
        : `❌ Your Event "${eventName}" Has Been Rejected — ${BRAND}`,
      html,
    });

    console.log(`✅ Event ${status} email sent to ${hostEmail}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to send event ${status} notification:`, err.message);
    return false;
  }
};

/* =================================================
   3. ADMIN NOTIFICATION — NEW EVENT SUBMITTED
================================================= */
exports.sendAdminNewEventNotification = async (adminEmail, eventName, hostName, eventDetails) => {
  try {
    const transporter = await createTransporter();

    const rows = [
      infoRow("👤", "Submitted by", hostName),
      infoRow("🏷️", "Category", eventDetails.category ? eventDetails.category.charAt(0).toUpperCase() + eventDetails.category.slice(1) : null),
      infoRow("📅", "Date", formatDate(eventDetails.eventDate)),
      infoRow("⏰", "Time", eventDetails.eventTime),
      infoRow("👥", "Capacity", eventDetails.capacity ? `${eventDetails.capacity} participants` : null),
    ].join("");

    const body = `
      <p style="font-size:16px;color:#1f2937;margin:0 0 8px;">Hello Admin,</p>
      <p style="font-size:14px;color:#4b5563;line-height:1.6;">A new event has been submitted and is awaiting your review.</p>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0;">
        <h3 style="margin:0 0 4px;color:#1f2937;font-size:18px;">${eventName}</h3>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">${rows}</table>
        ${eventDetails.description ? `<p style="margin:14px 0 0;color:#6b7280;font-size:13px;line-height:1.5;border-top:1px solid #e5e7eb;padding-top:14px;">${eventDetails.description}</p>` : ""}
      </div>

      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:14px;border-radius:6px;margin:20px 0;">
        <p style="margin:0;color:#92400e;font-size:14px;"><strong>⚡ Action Required:</strong> Please review and approve or reject this event.</p>
      </div>

      ${btn(frontendUrl() + "/admin/events", "Review Events", "#7c3aed")}
    `;

    const html = baseWrapper(
      "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
      "🎯 New Event Awaiting Approval",
      body
    );

    await transporter.sendMail({
      from: `"${BRAND}" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to: adminEmail,
      subject: `🎯 New Event Submitted: "${eventName}" — ${BRAND}`,
      html,
    });

    console.log("✅ Admin notification email sent to", adminEmail);
    return true;
  } catch (err) {
    console.error("❌ Failed to send admin notification email:", err.message);
    return false;
  }
};

/* =================================================
   4. EVENT REGISTRATION CONFIRMATION → USER
================================================= */
exports.sendEventRegistrationConfirmation = async (to, name, eventName, eventDate, eventTime, eventDescription) => {
  try {
    const transporter = await createTransporter();

    const body = `
      <p style="font-size:16px;color:#1f2937;margin:0 0 8px;">Hello ${name},</p>
      <p style="font-size:15px;color:#059669;font-weight:600;">🎉 You're registered! Your spot for "${eventName}" has been confirmed.</p>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0;">
        <h3 style="margin:0 0 14px;color:#1f2937;font-size:16px;">📋 Event Details</h3>
        <table style="width:100%;border-collapse:collapse;">
          ${infoRow("📌", "Event", eventName)}
          ${infoRow("📅", "Date", formatDate(eventDate))}
          ${infoRow("⏰", "Time", eventTime || "TBD")}
        </table>
        ${eventDescription ? `<p style="margin:14px 0 0;color:#6b7280;font-size:13px;line-height:1.5;border-top:1px solid #e5e7eb;padding-top:14px;"><strong>About:</strong> ${eventDescription}</p>` : ""}
      </div>

      <div style="background:#ecfdf5;border-left:4px solid #10b981;padding:14px;border-radius:6px;margin:20px 0;">
        <p style="margin:0;color:#065f46;font-size:14px;"><strong>What's next?</strong> You'll receive meeting link details and reminders closer to the event date.</p>
      </div>

      ${btn(frontendUrl() + "/events", "View All Events")}
    `;

    const html = baseWrapper(
      "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
      "🎟️ Registration Confirmed",
      body
    );

    await transporter.sendMail({
      from: `"${BRAND}" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to,
      subject: `🎟️ Registration Confirmed — ${eventName} | ${BRAND}`,
      html,
    });

    console.log("✅ Registration confirmation sent to", to);
    return true;
  } catch (err) {
    console.error("❌ Failed to send registration confirmation:", err.message);
    return false;
  }
};

/* =================================================
   5. PASSWORD RESET EMAIL
================================================= */
exports.sendPasswordResetMail = async (to, resetLink, role) => {
  try {
    const transporter = await createTransporter();

    const body = `
      <p style="font-size:16px;color:#1f2937;margin:0 0 8px;">Hello,</p>
      <p style="font-size:14px;color:#4b5563;line-height:1.6;">
        We received a request to reset the password for your <strong>${role}</strong> account.
      </p>

      ${btn(resetLink, "Reset Password", "#dc2626")}

      <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px;border-radius:6px;margin:20px 0;">
        <p style="margin:0;color:#991b1b;font-size:14px;"><strong>⏰ This link expires in 15 minutes.</strong></p>
      </div>

      <p style="font-size:13px;color:#9ca3af;line-height:1.5;">If you did not request this, you can safely ignore this email. Your password will remain unchanged.</p>
    `;

    const html = baseWrapper(
      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      "🔐 Password Reset Request",
      body
    );

    await transporter.sendMail({
      from: `"${BRAND}" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to,
      subject: `🔐 Reset Your Password — ${BRAND} (${role})`,
      html,
    });

    console.log("✅ Password reset email sent to", to);
    return true;
  } catch (err) {
    console.error("❌ Failed to send password reset email:", err.message);
    return false;
  }
};

/* =================================================
   6. LOGIN NOTIFICATION
================================================= */
exports.sendLoginNotificationMail = async (to, role) => {
  try {
    const transporter = await createTransporter();
    const now = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const body = `
      <p style="font-size:16px;color:#1f2937;margin:0 0 8px;">Hello,</p>
      <p style="font-size:14px;color:#4b5563;line-height:1.6;">
        Your <strong>${role}</strong> account was just signed into.
      </p>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:20px 0;">
        <table style="width:100%;border-collapse:collapse;">
          ${infoRow("🕐", "Time", now)}
          ${infoRow("👤", "Role", role)}
        </table>
      </div>

      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:14px;border-radius:6px;margin:20px 0;">
        <p style="margin:0;color:#92400e;font-size:14px;"><strong>Not you?</strong> Secure your account immediately by resetting your password.</p>
      </div>
    `;

    const html = baseWrapper(
      `linear-gradient(135deg, ${BRAND_COLOR} 0%, #1d4ed8 100%)`,
      "🔔 Login Notification",
      body
    );

    await transporter.sendMail({
      from: `"${BRAND}" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to,
      subject: `🔔 New Login Detected — ${BRAND} (${role})`,
      html,
    });

    console.log("✅ Login notification sent to", to);
    return true;
  } catch (err) {
    console.error("❌ Failed to send login notification:", err.message);
    return false;
  }
};

/* =================================================
   7. UPCOMING EVENT REMINDER → REGISTERED USERS
================================================= */
exports.sendUpcomingEventReminder = async (to, userName, eventDetails) => {
  try {
    const transporter = await createTransporter();

    const rows = [
      infoRow("📌", "Event", eventDetails.eventName),
      infoRow("📅", "Date", formatDate(eventDetails.eventDate)),
      infoRow("⏰", "Time", eventDetails.eventTime || "TBD"),
      infoRow("🏷️", "Category", eventDetails.category ? eventDetails.category.charAt(0).toUpperCase() + eventDetails.category.slice(1) : null),
      infoRow("👥", "Capacity", eventDetails.capacity ? `${eventDetails.capacity} participants` : null),
      infoRow("🔗", "Meeting Link", eventDetails.meetingLink ? `<a href="${eventDetails.meetingLink}" style="color:${BRAND_COLOR};word-break:break-all;">${eventDetails.meetingLink}</a>` : null),
    ].join("");

    const body = `
      <p style="font-size:16px;color:#1f2937;margin:0 0 8px;">Hello ${userName},</p>
      <p style="font-size:15px;color:#4b5563;line-height:1.6;">
        This is a friendly reminder that an event you registered for is coming up soon! 🎯
      </p>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin:20px 0;">
        <h3 style="margin:0 0 14px;color:#1f2937;font-size:16px;">📋 Full Event Details</h3>
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
        ${eventDetails.description ? `<p style="margin:14px 0 0;color:#6b7280;font-size:13px;line-height:1.5;border-top:1px solid #e5e7eb;padding-top:14px;"><strong>About:</strong> ${eventDetails.description}</p>` : ""}
      </div>

      <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-left:4px solid #10b981;padding:16px;border-radius:6px;margin:20px 0;">
        <p style="margin:0;color:#065f46;font-size:14px;">
          <strong>🎯 Get ready!</strong> Make sure to join on time using the meeting link above. We look forward to seeing you there!
        </p>
      </div>

      ${eventDetails.meetingLink ? btn(eventDetails.meetingLink, "Join Event Now", "#10b981") : btn(frontendUrl() + "/events", "View Events")}
    `;

    const html = baseWrapper(
      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      "⏰ Upcoming Event Reminder",
      body
    );

    await transporter.sendMail({
      from: `"${BRAND}" <${process.env.EMAIL_USER || "no-reply@talentconnect.com"}>`,
      to,
      subject: `⏰ Reminder: "${eventDetails.eventName}" is coming up! — ${BRAND}`,
      html,
    });

    console.log("✅ Event reminder sent to", to);
    return true;
  } catch (err) {
    console.error("❌ Failed to send event reminder to", to, ":", err.message);
    return false;
  }
};

/* =================================================
   8. SEND UPCOMING EVENT REMINDERS (batch job)
      Sends reminders for events happening in next 24h
================================================= */
exports.sendUpcomingEventReminders = async () => {
  try {
    const Event = require("../models/event.model");
    const EventRegistration = require("../models/eventRegistration.model");
    const Registration = require("../models/registration.model");
    const User = require("../models/user.model");

    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find approved events happening in the next 24 hours
    const upcomingEvents = await Event.find({
      approvalStatus: "approved",
      eventStatus: "upcoming",
      eventDate: { $gte: now, $lte: in24h },
    });

    if (upcomingEvents.length === 0) {
      console.log("📭 No upcoming events in the next 24 hours.");
      return { sent: 0, events: 0 };
    }

    console.log(`📬 Found ${upcomingEvents.length} upcoming event(s). Sending reminders...`);

    let totalSent = 0;

    for (const event of upcomingEvents) {
      const eventDetails = {
        eventName: event.eventName,
        description: event.description,
        eventDate: event.eventDate,
        eventTime: event.eventTime,
        category: event.category,
        capacity: event.capacity,
        meetingLink: event.meetingLink,
      };

      // Get registrations from EventRegistration model (public registration form)
      const publicRegistrations = await EventRegistration.find({ eventId: event._id });

      for (const reg of publicRegistrations) {
        await exports.sendUpcomingEventReminder(reg.email, reg.name, eventDetails);
        totalSent++;
      }

      // Get registrations from Registration model (logged-in user registration)
      const userRegistrations = await Registration.find({ eventId: event._id }).populate("userId", "fullname email");

      for (const reg of userRegistrations) {
        if (reg.userId && reg.userId.email) {
          // Skip if already sent via public registration
          const alreadySent = publicRegistrations.some(
            (pr) => pr.email.toLowerCase() === reg.userId.email.toLowerCase()
          );
          if (alreadySent) continue;

          const userName = reg.userId.fullname
            ? `${reg.userId.fullname.firstname} ${reg.userId.fullname.lastname}`
            : "User";

          await exports.sendUpcomingEventReminder(reg.userId.email, userName, eventDetails);
          totalSent++;
        }
      }
    }

    console.log(`✅ Sent ${totalSent} event reminder(s) for ${upcomingEvents.length} event(s).`);
    return { sent: totalSent, events: upcomingEvents.length };
  } catch (err) {
    console.error("❌ Failed to send upcoming event reminders:", err.message);
    return { sent: 0, events: 0, error: err.message };
  }
};

/* =================================================
   LEGACY ALIAS — keeps old imports working
================================================= */
exports.sendEventApprovalMail = exports.sendEventDecisionNotification;
