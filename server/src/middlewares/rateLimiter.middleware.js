const rateLimit = require("express-rate-limit");
const ApiError = require("../utils/apiError");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new ApiError(
        429,
        "Too many login attempts from this IP. Please try again after 15 minutes."
      )
    );
  },
});

module.exports = { authLimiter };
