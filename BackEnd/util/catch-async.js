/**
 * Utility function to wrap async route handlers and pass errors to Express error middleware.
 *
 * @function
 * @param {Function} fn - An async function (route handler) that takes (req, res, next).
 * @returns {Function} A middleware function that executes `fn` and catches any errors,
 * forwarding them to Express error handling with `next(err)`.
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
