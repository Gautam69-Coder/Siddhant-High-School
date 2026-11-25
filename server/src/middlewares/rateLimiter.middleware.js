const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");
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

const createPublicSubmissionLimiter = ({ windowMs, max, message }) => rateLimit({
  windowMs,
  max,
  // Use the actual peer address; never accept client-supplied forwarding headers.
  keyGenerator: (req) => ipKeyGenerator(req.socket.remoteAddress || req.ip || "unknown"),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, message));
  },
});

const publicAdmissionLimiter = createPublicSubmissionLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many admission submissions. Please try again later.",
});

const publicEnquiryLimiter = createPublicSubmissionLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many enquiry submissions. Please try again later.",
});

module.exports = { authLimiter, publicAdmissionLimiter, publicEnquiryLimiter };
