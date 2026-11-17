
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
router.post("/", createAdmission);

// Get all admission applications
router.get("/", getAllAdmissions);

// Get one admission by ID or application number
router.get("/:id", getAdmissionById);

// Update application status
router.patch("/:id/status", updateAdmissionStatus);

// Delete an application
router.delete("/:id", deleteAdmission);

module.exports = router;
