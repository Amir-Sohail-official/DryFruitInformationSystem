const AppError = require("../util/app-errors");
const contactRepo = require("../repository/contact");
const sendEmail = require("../services/email");

exports.createContact = async (body, user) => {
  let contactData = {
    subject: body.subject,
    message: body.message,
  };

  if (user) {
    contactData.user = user._id;
    contactData.firstName = user.firstName;
    contactData.lastName = user.lastName;
    contactData.email = user.email;
  } else {
    if (!body.firstName || !body.email) {
      throw new AppError("First name and email are required for guests");
    }
    contactData.firstName = body.firstName;
    contactData.lastName = body.lastName || "";
    contactData.email = body.email;
  }

  const newContact = await contactRepo.create(contactData);

  // 💌 Email to Admin
  await sendEmail({
    email: "asmatullah6090@gmail.com",
    subject: `📩 New Message from ${contactData.firstName} - ${contactData.subject}`,

    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #007bff; color: white; padding: 15px 20px;">
            <h2 style="margin: 0; font-size: 20px;">New Contact Query Received</h2>
          </div>
          <div style="padding: 20px; color: #333;">
            <p><strong>Name:</strong> ${contactData.firstName} ${
      contactData.lastName || ""
    }</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <div style="margin-top: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <h4 style="margin: 0 0 10px 0; color: #007bff;">Message</h4>
              <p style="margin: 0;">${contactData.message}</p>
            </div>
          </div>
          <div style="padding: 15px 20px; font-size: 12px; color: #999; background-color: #f4f6f8; text-align: center;">
            © ${new Date().getFullYear()} Dry Fruit Finder | This is an automated message. Do not reply.
          </div>
        </div>
      </div>
    `,
  });

  // 💌 Confirmation Email to User
  await sendEmail({
    email: contactData.email,
    subject: `Thanks for reaching out, ${contactData.firstName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #007bff; color: white; padding: 15px 20px;">
            <h2 style="margin: 0; font-size: 20px;">Query Received - Thank You</h2>
          </div>
          <div style="padding: 20px; color: #333;">
            <p>Dear ${contactData.firstName || "User"},</p>
            <p>Thank you for contacting us. We have received your query and our team will review it soon.</p>

            <div style="margin-top: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
              <h4 style="margin: 0 0 10px 0; color: #007bff;">Your Message</h4>
              <p style="margin: 0;">${contactData.message}</p>
            </div>

            <p style="margin-top: 20px;">We’ll get back to you as soon as possible.</p>
            <p>Best regards,<br><strong>Support Team</strong></p>
          </div>
          <div style="padding: 15px 20px; font-size: 12px; color: #999; background-color: #f4f6f8; text-align: center;">
            © ${new Date().getFullYear()} Dry Fruit Finder | This is an automated message. Do not reply.
          </div>
        </div>
      </div>
    `,
  });

  return newContact;
};

exports.getAllContacts = async () => {
  return await contactRepo.findAll();
};

exports.deleteContact = async (id) => {
  return await contactRepo.deleteById(id);
};
