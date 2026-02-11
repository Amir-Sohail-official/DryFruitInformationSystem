const userRepository = require("../repository/user");
const AppError = require("../util/app-errors");
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.updateMe = async (userId, body) => {
  const filterBody = filterObj(
    body,
    "firstName",
    "lastName",
    "phoneNumber",
    "profileImage"
  );

  const updatedUser = await userRepository.updateById(userId, filterBody, {
    new: true,
    runValidators: true,
  });
  return updatedUser;
};
exports.deleteMe = async (userId) => {
  return await userRepository.updateById(userId, { active: false });
};
exports.getAllUsers = async (page, limit, isAdmin = false) => {
  if (!isAdmin) {
    throw new AppError("You are not authorized to view all users", 403);
  }
  const skip = (page - 1) * limit;
  const data = await userRepository.findAllWithoutFilter(skip, limit);
  const total = await userRepository.countUsers();
  return { total, data };
};
exports.updateUser = async (id, userData) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const allowedUpdates = {};
  if (userData.role) {
    allowedUpdates.role = userData.role;
  }
  if (userData.status) {
    allowedUpdates.active = userData.status === "active";
  } else if (typeof userData.active === "boolean") {
    allowedUpdates.active = userData.active;
  }
  if (Object.keys(allowedUpdates).length === 0) {
    throw new AppError("No valid fields provided for update", 400);
  }
  const updatedUser = await userRepository.updateById(id, allowedUpdates, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};
exports.deleteUserByAdmin = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const deletedUser = await userRepository.updateById(id, { active: false });
  return deletedUser;
};

exports.getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError("No user found with this ID", 404);
  }
  return user;
};
