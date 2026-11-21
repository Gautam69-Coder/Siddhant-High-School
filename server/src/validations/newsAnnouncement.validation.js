const { NEWS_CATEGORIES, NEWS_STATUS } = require("../constants/enums");
const ApiError = require("../utils/apiError");

const validateCreateNewsAnnouncement = (req, res, next) => {
  const { title, category, is_urgent, publish_date, status } = req.body;
  const errors = [];

  if (!title || !title.trim()) {
    errors.push("Title is required");
  } else if (title.trim().length > 500) {
    errors.push("Title cannot exceed 500 characters");
  }

  if (!category) {
    errors.push("Category is required");
  } else if (!NEWS_CATEGORIES.includes(category)) {
    errors.push(`Invalid category. Allowed values: ${NEWS_CATEGORIES.join(", ")}`);
  }

  if (is_urgent !== undefined && typeof is_urgent !== "boolean") {
    errors.push("is_urgent must be a boolean");
  }

  if (status !== undefined && !Object.values(NEWS_STATUS).includes(status)) {
    errors.push(`Invalid status. Allowed values: ${Object.values(NEWS_STATUS).join(", ")}`);
  }

  if (publish_date) {
    const parsedDate = new Date(publish_date);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.push("Invalid publish_date format");
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

const validateUpdateNewsAnnouncement = (req, res, next) => {
  const { title, category, is_urgent, publish_date, status } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (!title.trim()) {
      errors.push("Title cannot be empty");
    } else if (title.trim().length > 500) {
      errors.push("Title cannot exceed 500 characters");
    }
  }

  if (category !== undefined && !NEWS_CATEGORIES.includes(category)) {
    errors.push(`Invalid category. Allowed values: ${NEWS_CATEGORIES.join(", ")}`);
  }

  if (is_urgent !== undefined && typeof is_urgent !== "boolean") {
    errors.push("is_urgent must be a boolean");
  }

  if (status !== undefined && !Object.values(NEWS_STATUS).includes(status)) {
    errors.push(`Invalid status. Allowed values: ${Object.values(NEWS_STATUS).join(", ")}`);
  }

  if (publish_date !== undefined) {
    const parsedDate = new Date(publish_date);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.push("Invalid publish_date format");
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

module.exports = {
  validateCreateNewsAnnouncement,
  validateUpdateNewsAnnouncement,
};
