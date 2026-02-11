const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../util/app-errors");
const catchAsync = require("../util/catch-async");
const { promisify } = require("util");
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) getting the token and check if that is there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in! Please log in.", 401));
  }
  //2) checking if the token is valid or not
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );
  //3) check if user is still exits
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("The user no longer exists.", 401));
  }
  //4)check if the user changed password after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission", 403));
    }
    next();
  };
};
