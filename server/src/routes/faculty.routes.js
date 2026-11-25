const { Router } = require("express");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { requireCsrfToken } = require("../middlewares/csrf.middleware");
const { ROLES } = require("../constants/enums");

const {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/faculty.controller");

const router = Router();

// Create faculty
router.post(
  "/",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.CMS_EDITOR),
  requireCsrfToken,
  createFaculty
);

// Get all faculty
router.get("/", getAllFaculty);

// Get faculty by ID
router.get("/:id", getFacultyById);

// Update faculty
router.put(
  "/:id",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.CMS_EDITOR),
  requireCsrfToken,
  updateFaculty
);

// Delete faculty
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.CMS_EDITOR),
  requireCsrfToken,
  deleteFaculty
);

module.exports = router;
