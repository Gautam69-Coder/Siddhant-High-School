const { GALLERY_CATEGORIES, MEDIA_TYPES } = require("../constants/enums");
const ApiError = require("../utils/apiError");

const validateUpdateGalleryMedia = (req, res, next) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return next(new ApiError(400, "Request body must be a JSON object"));
  }
  const body = req.body;
  const { title, category, media_type, display_order, tags } = body;
  const errors = [];

  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    errors.push("Title cannot be empty");
  }

  if (category !== undefined && (typeof category !== "string" || !GALLERY_CATEGORIES.includes(category))) {
    errors.push(`Invalid category. Allowed values: ${GALLERY_CATEGORIES.join(", ")}`);
  }

  if (media_type !== undefined && (typeof media_type !== "string" || !MEDIA_TYPES.includes(media_type))) {
    errors.push(`Invalid media_type. Allowed values: ${MEDIA_TYPES.join(", ")}`);
  }

  if (display_order !== undefined && (typeof display_order !== "number" || !Number.isFinite(display_order))) {
    errors.push("display_order must be a number");
  }

  if (tags !== undefined && (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string"))) {
    errors.push("tags must be an array of text values");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

module.exports = {
  validateUpdateGalleryMedia,
};
