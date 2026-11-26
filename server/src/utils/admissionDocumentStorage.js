const fs = require("fs");
const path = require("path");

const PRIVATE_ADMISSIONS_DIR = path.resolve(__dirname, "../../private_uploads/admissions");
const LEGACY_ADMISSIONS_DIR = path.resolve(__dirname, "../../uploads/admissions");
const ADMISSION_DOCUMENT_FIELDS = [
  "student_photo",
  "birth_certificate",
  "previous_school_report",
];

const MIME_TYPES_BY_EXTENSION = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".pdf": "application/pdf",
};

const getSignatureMimeType = (buffer) => {
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
  if (buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "%PDF-") {
    return "application/pdf";
  }
  return null;
};

const getAdmissionDocumentLocation = (storedReference) => {
  if (typeof storedReference !== "string") return null;

  let directory;
  let filename;
  if (storedReference.startsWith("private-admissions/")) {
    directory = PRIVATE_ADMISSIONS_DIR;
    filename = storedReference.slice("private-admissions/".length);
  } else if (storedReference.startsWith("/uploads/admissions/")) {
    directory = LEGACY_ADMISSIONS_DIR;
    filename = storedReference.slice("/uploads/admissions/".length);
  } else {
    return null;
  }

  if (!/^[a-zA-Z0-9_-]+\.(jpe?g|png|pdf)$/i.test(filename)) return null;
  const absolutePath = path.resolve(directory, filename);
  if (!absolutePath.startsWith(`${directory}${path.sep}`)) return null;

  return {
    absolutePath,
    filename,
    extension: path.extname(filename).toLowerCase(),
    mimeType: MIME_TYPES_BY_EXTENSION[path.extname(filename).toLowerCase()],
  };
};

const serializeAdmission = (application) => {
  const serialized = typeof application?.toObject === "function"
    ? application.toObject()
    : { ...application };
  const documents = {};
  const documentMimeTypes = {};

  for (const field of ADMISSION_DOCUMENT_FIELDS) {
    const storedReference = serialized.documents?.[field];
    const location = getAdmissionDocumentLocation(storedReference);
    documents[field] = location
      ? `/api/v1/admissions/${encodeURIComponent(serialized.application_number)}/documents/${field}`
      : null;
    documentMimeTypes[field] = location?.mimeType || null;
  }

  serialized.documents = documents;
  serialized.document_mime_types = documentMimeTypes;
  return serialized;
};

const deleteAdmissionDocument = async (storedReference) => {
  const location = getAdmissionDocumentLocation(storedReference);
  if (!location) return;
  try {
    await fs.promises.unlink(location.absolutePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

module.exports = {
  ADMISSION_DOCUMENT_FIELDS,
  LEGACY_ADMISSIONS_DIR,
  MIME_TYPES_BY_EXTENSION,
  PRIVATE_ADMISSIONS_DIR,
  deleteAdmissionDocument,
  getAdmissionDocumentLocation,
  getSignatureMimeType,
  serializeAdmission,
};
