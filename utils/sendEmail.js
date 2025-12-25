const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // Create transporter
  // For dev/demo purposes, we use Ethereal or a placeholder
  // In product
  // EMAIL_HOST=sandbox.smtp.mailtrap.io
// EMAIL_PORT=2525ion, use SendGrid, Mailgun, or Gmail with App Password
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: process.env.EMAIL_PORT || 2525,
    auth: {
      user: process.env.EMAIL_USER || "user",
      pass: process.env.EMAIL_PASSWORD || "pass",
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || "Krishi Kishan"} <${process.env.FROM_EMAIL || "noreply@krishikishan.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message, // Fallback to text if no html
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
