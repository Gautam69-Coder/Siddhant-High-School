const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const ApiError = require("../utils/apiError");

const galleryUploadDir = path.join(__dirname, "../../uploads/gallery");

// Ensure upload directory exists
if (!fs.existsSync(galleryUploadDir)) {
  fs.mkdirSync(galleryUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(galleryUploadDir)) {
      fs.mkdirSync(galleryUploadDir, { recursive: true });
    }
    cb(null, galleryUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    cb(null, `gallery-${sanitizedBase}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /^\.(jpe?g|png|webp)$/i;
  const allowedMimeTypes = /^image\/(jpeg|png|webp)$/i;

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedExtensions.test(ext) && allowedMimeTypes.test(mime)) {
    cb(null, true);
  } else {
    const error = new ApiError(
      400,
      "Only JPG, JPEG, PNG, and WebP images up to 10MB are allowed"
    );
    cb(error, false);
  }
};

const galleryUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit per file (matching UI specifications)
  },
  fileFilter,
});

module.exports = galleryUpload;
