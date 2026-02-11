const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create transporter
  const hasCreds =
    !!process.env.EMAIL_USERNAME && !!process.env.EMAIL_PASSWORD;
  if (!hasCreds) {
    return;
  }
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `"Support Team" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    // If HTML exists, use it; otherwise, fallback to plain text
    html: options.html || undefined,
    text: options.message || undefined,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
