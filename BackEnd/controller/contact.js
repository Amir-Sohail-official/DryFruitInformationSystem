const contactService = require("../services/contact");
const catchAsync = require("../util/catch-async");

exports.createContact = catchAsync(async (req, res) => {
  const contact = await contactService.createContact(req.body, req.user);
  const responseData = {
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    subject: contact.subject,
    message: contact.message,
  };

  res.status(201).json({
    status: "success",
    message: "Your query has been submitted successfully",
    data: responseData,
  });
});

exports.getAllContacts = catchAsync(async (req, res) => {
  const contacts = await contactService.getAllContacts();
  res.status(200).json({
    status: "success",
    results: contacts.length,
    data: contacts,
  });
});

exports.deleteContact = catchAsync(async (req, res) => {
  await contactService.deleteContact(req.params.id);
  res.status(204).json({ status: "success", message: "Contact deleted" });
});
