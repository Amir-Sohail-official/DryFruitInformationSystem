const AppError = require("../util/app-errors");
const catchAsync = require("../util/catch-async");
const authService = require("../services/auth");
const cloudinary = require("../util/cloudinary");

const createSendToken = (user, statusCode, res) => {
  const token = authService.generateToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
      },
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new AppError("No request body provided", 400));
  }
  const signupData = req.body;

  const uploadsConfigured =
    process.env.CLOUDINARY_URL ||
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET);
  if (!uploadsConfigured) {
    return next(
      new AppError("Image upload is not configured on the server", 503)
    );
  }

  if (!req.file) {
    return next(new AppError("Please upload profile picture", 400));
  }

  const buffer = req.file.buffer;
  const streamUpload = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "dryfruit/users", resource_type: "image" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(buffer);
    });
  const result = await streamUpload();
  signupData.profileImage = result.secure_url;

  const newUser = await authService.signupUser(signupData);

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await authService.loginUser(email, password);
  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const resetToken = await authService.forgotPassword(req.body.email, req);
  res.status(200).json({
    status: "success",
    resetToken: resetToken,
    message: "Token has been sent to the email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await authService.resetPassword(
    req.params.token,
    req.body.password,
    req.body.passwordConfirm
  );
  createSendToken(user, 200, res);
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
  const user = await authService.updateMyPassword(
    req.user.id,
    req.body.currentPassword,
    req.body.password,
    req.body.passwordConfirm
  );
  createSendToken(user, 200, res);
});
