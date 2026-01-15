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
