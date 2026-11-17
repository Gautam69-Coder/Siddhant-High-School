const upload = require("../middlewares/multer.middleware");
const { Router } = require("express");

const {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmissionStatus,
  deleteAdmission,
} = require("../controllers/admission.controller");

const router = Router();

// Submit a new admission
router.post(
  "/",
  upload.fields([
    { name: "student_photo", maxCount: 1 },
    { name: "birth_certificate", maxCount: 1 },
    { name: "previous_school_report", maxCount: 1 },
  ]),
  createAdmission
);

// Get all admission applications
router.get("/", getAllAdmissions);

// Get one admission by ID or application number
router.get("/:id", getAdmissionById);

// Update application status
router.patch("/:id/status", updateAdmissionStatus);

// Delete an application
router.delete("/:id", deleteAdmission);

module.exports = router;
