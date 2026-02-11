const Feedback = require("../models/feed-back");

exports.create = async (data) => {
  return await Feedback.create(data);
};

exports.findAll = async () => {
  return await Feedback.find({}, "type rating message user ").populate(
    "user",
    "firstName email -_id"
  );
};

exports.findById = async (id) => {
  return await Feedback.findById(id, "type rating message user ").populate(
    "user",
    "firstName email -_id"
  );
};

exports.deleteById = async (id) => {
  return await Feedback.findByIdAndDelete(id);
};
exports.countDocument = async () => {
  return await Feedback.countDocuments();
};
