const {
  admissionUpload,
  handleMulterError,
  validateAndStoreAdmissionFiles,
} = require("../middlewares/multer.middleware");
const { Router } = require("express");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { requireCsrfToken } = require("../middlewares/csrf.middleware");
const { ROLES } = require("../constants/enums");
const { publicAdmissionLimiter } = require("../middlewares/rateLimiter.middleware");
const { validateAdmission } = require("../validations/admission.validation");

const {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmissionStatus,
  deleteAdmission,
  getAdmissionDocument,
} = require("../controllers/admission.controller");

const router = Router();

const parseAdmissionFiles = (req, res, next) => {
  admissionUpload.fields([
    { name: "student_photo", maxCount: 1 },
    { name: "birth_certificate", maxCount: 1 },
    { name: "previous_school_report", maxCount: 1 },
  ])(req, res, (error) => handleMulterError(error, req, res, next));
};

// Submit a new admission
router.post(
  "/",
  publicAdmissionLimiter,
  parseAdmissionFiles,
  validateAdmission,
  validateAndStoreAdmissionFiles,
  createAdmission
);

// Private document access is limited to authorized admissions staff.
router.get(
  "/:id/documents/:field",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMISSIONS_OFFICER),
  getAdmissionDocument
);

// Get all admission applications
router.get(
  "/",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMISSIONS_OFFICER),
  getAllAdmissions
);

// Get one admission by ID or application number
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMISSIONS_OFFICER),
  getAdmissionById
);

// Update application status
router.patch(
  "/:id/status",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMISSIONS_OFFICER),
  requireCsrfToken,
  updateAdmissionStatus
);

// Delete an application
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMISSIONS_OFFICER),
  requireCsrfToken,
  deleteAdmission
);

module.exports = router;
