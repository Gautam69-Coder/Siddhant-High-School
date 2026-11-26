const ApiError = require("../utils/apiError");
const { ROLES } = require("../constants/enums");
const {
  MAX_BCRYPT_PASSWORD_BYTES,
  MIN_PASSWORD_CHARACTERS,
  getPasswordByteCount,
  getPasswordCharacterCount,
} = require("../utils/adminPasswordPolicy");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateLogin = (req, res, next) => {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : {};
  const { email, password } = body;
  const errors = [];

  if (typeof email !== "string" || !email.trim()) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  if (typeof password !== "string" || !password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

const validateRegister = (req, res, next) => {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : {};
  const { email, password, full_name, role } = body;
  const errors = [];

  if (typeof email !== "string" || !email.trim()) {
    errors.push("Email is required");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Please provide a valid institutional email");
  }

  if (typeof password !== "string" || getPasswordCharacterCount(password) < MIN_PASSWORD_CHARACTERS) {
    errors.push("Password must be at least 12 characters long");
  } else if (getPasswordByteCount(password) > MAX_BCRYPT_PASSWORD_BYTES) {
    errors.push("Password cannot exceed 72 UTF-8 bytes");
  }

  if (typeof full_name !== "string" || !full_name.trim()) {
    errors.push("Full name is required");
  }

  if (
    Object.prototype.hasOwnProperty.call(body, "role") &&
    !Object.values(ROLES).includes(role)
  ) {
    errors.push(`Role must be one of: ${Object.values(ROLES).join(", ")}`);
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

const validateChangePassword = (req, res, next) => {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : {};
  const { currentPassword, newPassword } = body;
  const errors = [];

  if (typeof currentPassword !== "string" || !currentPassword) {
    errors.push("Current password is required");
  }

  if (typeof newPassword !== "string" || getPasswordCharacterCount(newPassword) < MIN_PASSWORD_CHARACTERS) {
    errors.push("New password must be at least 12 characters long");
  } else if (getPasswordByteCount(newPassword) > MAX_BCRYPT_PASSWORD_BYTES) {
    errors.push("New password cannot exceed 72 UTF-8 bytes");
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
