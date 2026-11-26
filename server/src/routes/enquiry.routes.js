const { Router } = require("express");
const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiry.controller");
const { validateEnquiry } = require("../validations/enquiry.validation");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { requireCsrfToken } = require("../middlewares/csrf.middleware");
const { ROLES } = require("../constants/enums");
const { publicEnquiryLimiter } = require("../middlewares/rateLimiter.middleware");

const router = Router();

// Submit General Enquiry (Client)
router.post("/", publicEnquiryLimiter, validateEnquiry, createEnquiry);

// Get all enquiries (Admin)
router.get(
  "/",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMISSIONS_OFFICER),
  getAllEnquiries
);

// Update enquiry status (Admin)
router.patch(
  "/:id/status",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMISSIONS_OFFICER),
  requireCsrfToken,
  updateEnquiryStatus
);

// Delete enquiry (Admin)
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.ADMISSIONS_OFFICER),
  requireCsrfToken,
  deleteEnquiry
);

module.exports = router;
