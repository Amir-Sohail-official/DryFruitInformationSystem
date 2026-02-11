const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const catchAsync = require("../util/catch-async");

exports.optionalAuth = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET_KEY) {
      req.user = null;
      return next();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id).select(
      "firstName lastName email role"
    );
  } else {
    req.user = null;
  }

  next();
});
