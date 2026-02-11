/**
 * Custom Application Error for distinguishing between
 * operational (expected) and programming (unexpected) errors.
 */
class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message.
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500).
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; //

    // Captures stack trace without including constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
