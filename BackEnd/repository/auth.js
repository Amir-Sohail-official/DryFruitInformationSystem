const User = require("../models/user.model");
exports.createUser = async (userData) => {
  return await User.create(userData);
};
exports.findUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};
exports.findUserById = async (id) => {
  return await User.findById(id).select("+password");
};
exports.findUserByPasswordResetToken = async (hashedToken) => {
  return await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
};
