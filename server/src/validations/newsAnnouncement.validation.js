const { NEWS_CATEGORIES, NEWS_STATUS } = require("../constants/enums");
const ApiError = require("../utils/apiError");

const validateCreateNewsAnnouncement = (req, res, next) => {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body)
    ? req.body
    : {};
  const { title, category, content, is_urgent, publish_date, status } = body;
  const errors = [];

  if (typeof title !== "string" || !title.trim()) {
    errors.push("Title is required");
  } else if (title.trim().length > 500) {
    errors.push("Title cannot exceed 500 characters");
  }

  if (typeof category !== "string" || !category) {
    errors.push("Category is required");
  } else if (!NEWS_CATEGORIES.includes(category)) {
    errors.push(`Invalid category. Allowed values: ${NEWS_CATEGORIES.join(", ")}`);
  }

  if (content !== undefined && typeof content !== "string") {
    errors.push("Content must be text");
  }

  if (is_urgent !== undefined && typeof is_urgent !== "boolean") {
    errors.push("is_urgent must be a boolean");
  }

  if (status !== undefined && !Object.values(NEWS_STATUS).includes(status)) {
    errors.push(`Invalid status. Allowed values: ${Object.values(NEWS_STATUS).join(", ")}`);
  }

  if (publish_date !== undefined) {
    if (typeof publish_date !== "string" || !publish_date.trim()) {
      errors.push("Invalid publish_date format");
    } else {
    const parsedDate = new Date(publish_date);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.push("Invalid publish_date format");
    }
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

const validateUpdateNewsAnnouncement = (req, res, next) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return next(new ApiError(400, "Request body must be a JSON object"));
  }
  const body = req.body;
  const { title, category, content, is_urgent, publish_date, status } = body;
  const errors = [];

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      errors.push("Title cannot be empty");
    } else if (title.trim().length > 500) {
      errors.push("Title cannot exceed 500 characters");
    }
  }

  if (category !== undefined && (typeof category !== "string" || !NEWS_CATEGORIES.includes(category))) {
    errors.push(`Invalid category. Allowed values: ${NEWS_CATEGORIES.join(", ")}`);
  }

  if (content !== undefined && typeof content !== "string") {
    errors.push("Content must be text");
  }

  if (is_urgent !== undefined && typeof is_urgent !== "boolean") {
    errors.push("is_urgent must be a boolean");
  }

  if (status !== undefined && !Object.values(NEWS_STATUS).includes(status)) {
    errors.push(`Invalid status. Allowed values: ${Object.values(NEWS_STATUS).join(", ")}`);
  }

  if (publish_date !== undefined) {
    const parsedDate = typeof publish_date === "string" ? new Date(publish_date) : null;
    if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
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
