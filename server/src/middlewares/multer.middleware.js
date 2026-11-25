const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const ApiError = require("../utils/apiError");
const {
  MIME_TYPES_BY_EXTENSION,
  PRIVATE_ADMISSIONS_DIR,
  getSignatureMimeType,
} = require("../utils/admissionDocumentStorage");

const extensionMimeType = (filename) =>
  MIME_TYPES_BY_EXTENSION[path.extname(filename).toLowerCase()];

const fileFilter = (req, file, callback) => {
  const expectedMimeType = extensionMimeType(file.originalname);
  if (expectedMimeType && expectedMimeType === file.mimetype) {
    return callback(null, true);
  }
  return callback(new ApiError(400, "Only matching JPEG, PNG, and PDF files are allowed"));
};

const admissionUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 3,
    fields: 20,
    fieldSize: 16 * 1024,
    parts: 23,
  },
  fileFilter,
});

const validateAndStoreAdmissionFiles = async (req, res, next) => {
  const files = Object.values(req.files || {}).flat();
  const storedPaths = [];

  try {
    for (const file of files) {
      const expectedMimeType = extensionMimeType(file.originalname);
      if (!expectedMimeType || getSignatureMimeType(file.buffer) !== expectedMimeType) {
        throw new ApiError(400, "Uploaded file content does not match an allowed JPEG, PNG, or PDF format");
      }
    }

    await fs.promises.mkdir(PRIVATE_ADMISSIONS_DIR, { recursive: true });

    for (const file of files) {
      const extension = path.extname(file.originalname).toLowerCase();
      const filename = `${file.fieldname}-${crypto.randomBytes(16).toString("hex")}${extension}`;
      const destination = path.join(PRIVATE_ADMISSIONS_DIR, filename);
      await fs.promises.writeFile(destination, file.buffer, { flag: "wx" });
      storedPaths.push(destination);
      file.filename = filename;
      file.storageKey = `private-admissions/${filename}`;
      file.path = destination;
      file.mimeType = extensionMimeType(filename);
      delete file.buffer;
    }

    return next();
  } catch (error) {
    await Promise.all(storedPaths.map((storedPath) => fs.promises.unlink(storedPath).catch(() => {})));
    return next(error instanceof ApiError ? error : new ApiError(500, "Unable to securely store uploaded admission files"));
  }
};

const handleMulterError = (error, req, res, next) => {
  if (!error) return next();
  if (error instanceof multer.MulterError) {
    const statusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    const message = error.code === "LIMIT_FILE_SIZE"
      ? "Each admission document must be no larger than 5 MB"
      : "The admission upload contains an invalid or excessive number of files or fields";
    return next(new ApiError(statusCode, message));
  }
  return next(error);
};

module.exports = {
  admissionUpload,
  handleMulterError,
  validateAndStoreAdmissionFiles,
};
