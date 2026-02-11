const AppError = require("../util/app-errors");

const handleDuplicateFieldDB = (err) => {
  const value = err.keyValue
    ? Object.values(err.keyValue)[0]
    : err.message.match(/"([^"]+)"/)?.[1] || "Duplicate field";

  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}. Please use a valid ID format.`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJwtExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (err.code === 11000) error = handleDuplicateFieldDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJsonWebTokenError();
    if (err.name === "TokenExpiredError") error = handleJwtExpiredError();
    console.log("💡 Error being sent to client:", error);

    sendErrorProduction(error, res);
  }
};
