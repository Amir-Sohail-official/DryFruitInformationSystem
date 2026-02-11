const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userRepoSitry = require("../repository/auth");
const AppError = require("../util/app-errors");
const sendEmail = require("./email");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.generateToken = (userId) => {
  return signToken(userId);
};
exports.signupUser = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    role,
    profileImage,
  } = userData;
  const existingUser = await userRepoSitry.findUserByEmail(email);
  if (existingUser) throw new AppError("Email already in use", 400);
  const newUser = await userRepoSitry.createUser({
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    phoneNumber,
    role,
    profileImage,
  });
  newUser.password = undefined;
  newUser.__v = undefined;
  return newUser;
};

exports.loginUser = async (email, password) => {
  const user = await userRepoSitry.findUserByEmail(email);
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }
  user.password = undefined;
  return user;
};
exports.forgotPassword = async (email, req) => {
  const user = await userRepoSitry.findUserByEmail(email);
  if (!user) throw new AppError("No user with that email!", 404);
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.
If you didn't forget your password, please ignore this email.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });
    return resetToken;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError(
      "There was an error sending the email. Try again later!",
      500
    );
  }
};
exports.resetPassword = async (token, password, passwordConfirm) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await userRepoSitry.findUserByPasswordResetToken(hashedToken);
  if (!user) throw new AppError("Token is invalid or has expired", 400);
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  user.password = undefined;
  return user;
};
exports.updateMyPassword = async (
  userId,
  currentPassword,
  newPassword,
  passwordConfirm
) => {
  const user = await userRepoSitry.findUserById(userId);

  if (!(await user.correctPassword(currentPassword, user.password))) {
    throw new AppError("Your current password is wrong.", 401);
  }
  (user.password = newPassword), (user.passwordConfirm = passwordConfirm);
  await user.save();
  user.password = undefined;
  return user;
};
