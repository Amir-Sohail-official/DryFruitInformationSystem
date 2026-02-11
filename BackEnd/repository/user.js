const User = require("../models/user.model");

exports.findById = async (id) => {
  return await User.findById(id)
    .setOptions({ bypassFilter: true })
    .select("+active");
};

exports.findAll = async (skip, limit) => {
  return await User.find().select("+active").skip(skip).limit(limit);
};

exports.findAllWithoutFilter = async (skip, limit) => {
  return await User.find()
    .select("+active")
    .setOptions({ bypassFilter: true })
    .skip(skip)
    .limit(limit);
};

exports.countUsers = async () => {
  return await User.countDocuments();
};

exports.updateById = async (id, updateData, options = {}) => {
  // Merge bypassFilter: true to allow updates on inactive users (soft delete bypass)
  const fullOptions = { ...options, bypassFilter: true };
  return User.findByIdAndUpdate(id, updateData, fullOptions);
};
exports.countDocument = async () => {
  return await User.countDocuments();
};
