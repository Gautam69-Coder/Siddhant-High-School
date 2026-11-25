const ApiError = require("../utils/apiError");

const validateEnquiry = (req, res, next) => {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : {};
  const {
    parent_name,
    email,
    phone,
    category,
  } = body;

  const errors = [];

  if (typeof parent_name !== "string" || !parent_name.trim()) {
    errors.push("Parent name is required");
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push("Valid email is required");
  }

  if (typeof phone !== "string" || !phone.trim()) {
    errors.push("Contact number is required");
  }

  if (body.grade_interested !== undefined && body.grade_interested !== null && typeof body.grade_interested !== "string") {
    errors.push("Grade interested must be text");
  }
  if (body.message !== undefined && body.message !== null && typeof body.message !== "string") {
    errors.push("Message must be text");
  }

  const allowedCategories = [
    "Admission process",
    "School visit",
    "Academics",
    "Facilities",
    "General information",
  ];

  if (!allowedCategories.includes(category)) {
    errors.push("Please select a valid enquiry category");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

module.exports = { validateEnquiry };
