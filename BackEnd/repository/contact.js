const Contact = require("../models/contact");

exports.create = async (data) => {
  return await Contact.create(data);
};

exports.findAll = async () => {
  return await Contact.find().populate("user", "firstName lastName email");
};

exports.deleteById = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
exports.countDocument = async () => {
  return await Contact.countDocuments();
};
