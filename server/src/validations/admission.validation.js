const { GENDERS } = require("../constants/enums");
const ApiError = require("../utils/apiError");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^(\d{4}-\d{2}-\d{2})(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?)?$/;
const FIELD_LIMITS = {
  student_name: 150,
  dob: 35,
  gender: 40,
  grade_applying: 50,
  previous_school: 200,
  parent_name: 150,
  parent_email: 254,
  parent_phone: 20,
  address: 1000,
  city: 100,
  pincode: 10,
};

const isValidDate = (value) => {
  if (typeof value !== "string" || value.length > FIELD_LIMITS.dob) return false;
  const match = DATE_PATTERN.exec(value);
  if (!match || Number.isNaN(Date.parse(value))) return false;
  const [year, month, day] = match[1].split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

const validateAdmission = (req, res, next) => {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : {};
  const errors = [];
  const requiredFields = [
    ["student_name", "Student name is required"],
    ["dob", "Date of birth is required"],
    ["gender", "Gender is required"],
    ["grade_applying", "Grade applying for is required"],
    ["parent_name", "Parent name is required"],
    ["parent_email", "Parent email is required"],
    ["parent_phone", "Parent phone is required"],
    ["address", "Address is required"],
    ["city", "City is required"],
    ["pincode", "Pincode is required"],
  ];

  for (const [field, message] of requiredFields) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      errors.push(message);
    }
  }

  for (const [field, maxLength] of Object.entries(FIELD_LIMITS)) {
    const value = body[field];
    if (value !== undefined && value !== null && (typeof value !== "string" || value.length > maxLength)) {
      errors.push(`${field} must be text no longer than ${maxLength} characters`);
    }
  }

  if (typeof body.parent_email === "string" && body.parent_email.trim() &&
      (body.parent_email.trim().length > FIELD_LIMITS.parent_email || !EMAIL_PATTERN.test(body.parent_email.trim()))) {
    errors.push("Please provide a valid parent email address");
  }

  if (body.dob !== undefined && body.dob !== "" && !isValidDate(body.dob)) {
    errors.push("Please provide a valid date of birth");
  }

  if (typeof body.gender === "string" && body.gender.trim() && !GENDERS.includes(body.gender.trim())) {
    errors.push("Please select a valid gender");
  }

  if (typeof body.address === "string" && body.address.replace(/\s/g, "").length < 10) {
    errors.push("Address must contain at least 10 non-space characters");
  }

  if (typeof body.pincode === "string" && body.pincode.trim() && !/^\d{6}$/.test(body.pincode.trim())) {
    errors.push("Pincode must contain 6 digits");
  }

  if (errors.length) return next(new ApiError(400, "Validation failed", errors));
  return next();
};

module.exports = { validateAdmission };
