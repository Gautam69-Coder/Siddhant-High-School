const ApiError = require("../utils/apiError");

const validateEnquiry = (req, res, next) => {
  const {
    parent_name,
    email,
    phone,
    category,
  } = req.body;

  const errors = [];

  if (!parent_name || !parent_name.trim()) {
    errors.push("Parent name is required");
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }

  if (!phone || !phone.trim()) {
    errors.push("Contact number is required");
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