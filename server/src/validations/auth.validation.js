const ApiError = require("../utils/apiError");
const { ROLES } = require("../constants/enums");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { email, password, full_name, role } = req.body;
  const errors = [];

  if (!email || !email.trim()) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Please provide a valid institutional email");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!full_name || !full_name.trim()) {
    errors.push("Full name is required");
  }

  if (role && !Object.values(ROLES).includes(role)) {
    errors.push(`Role must be one of: ${Object.values(ROLES).join(", ")}`);
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword) {
    errors.push("Current password is required");
  }

  if (!newPassword || newPassword.length < 6) {
    errors.push("New password must be at least 6 characters long");
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push("New password cannot be identical to current password");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  validateChangePassword,
};
