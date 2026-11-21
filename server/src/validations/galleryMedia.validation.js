const { GALLERY_CATEGORIES, MEDIA_TYPES } = require("../constants/enums");
const ApiError = require("../utils/apiError");

const validateUpdateGalleryMedia = (req, res, next) => {
  const { title, category, media_type, display_order } = req.body;
  const errors = [];

  if (title !== undefined && !title.trim()) {
    errors.push("Title cannot be empty");
  }

  if (category !== undefined && !GALLERY_CATEGORIES.includes(category)) {
    errors.push(`Invalid category. Allowed values: ${GALLERY_CATEGORIES.join(", ")}`);
  }

  if (media_type !== undefined && !MEDIA_TYPES.includes(media_type)) {
    errors.push(`Invalid media_type. Allowed values: ${MEDIA_TYPES.join(", ")}`);
  }

  if (display_order !== undefined && typeof display_order !== "number") {
    errors.push("display_order must be a number");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

module.exports = {
  validateUpdateGalleryMedia,
};
