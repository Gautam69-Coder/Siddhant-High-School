/**
 * Async handler wrapper to catch unhandled promise rejections
 * and pass them automatically to Express's global next(err) handler.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;
