const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const ApiError = require("../utils/apiError");

const galleryUploadDir = path.join(__dirname, "../../uploads/gallery");
const allowedMimeTypesByExtension = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

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
    files: 20,
  },
  fileFilter,
});

const getGallerySignatureMimeType = (buffer) => {
  if (!Buffer.isBuffer(buffer)) return null;
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
};

const validateGalleryFileSignatures = async (req, res, next) => {
  const files = Array.isArray(req.files) ? req.files : [];
  if (files.length === 0) return next();

  try {
    for (const file of files) {
      const extension = path.extname(file.originalname).toLowerCase();
      const expectedMimeType = allowedMimeTypesByExtension[extension];
      const absoluteFilePath = path.resolve(file.path);
      const expectedDirectory = `${path.resolve(galleryUploadDir)}${path.sep}`;
      if (!expectedMimeType || file.mimetype !== expectedMimeType || !absoluteFilePath.startsWith(expectedDirectory)) {
        throw new ApiError(400, "Image content does not match an allowed JPG, PNG, or WebP format");
      }

      const handle = await fs.promises.open(absoluteFilePath, "r");
      let signature;
      try {
        signature = Buffer.alloc(12);
        const { bytesRead } = await handle.read(signature, 0, signature.length, 0);
        signature = signature.subarray(0, bytesRead);
      } finally {
        await handle.close();
      }

      if (getGallerySignatureMimeType(signature) !== expectedMimeType) {
        throw new ApiError(400, "Image content does not match an allowed JPG, PNG, or WebP format");
      }
    }

    return next();
  } catch (error) {
    await Promise.all(files.map((file) => fs.promises.unlink(file.path).catch(() => {})));
    return next(error instanceof ApiError ? error : new ApiError(400, "Unable to validate uploaded image content"));
  }
};

module.exports = galleryUpload;
module.exports.getGallerySignatureMimeType = getGallerySignatureMimeType;
module.exports.validateGalleryFileSignatures = validateGalleryFileSignatures;
