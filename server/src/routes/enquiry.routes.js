const { Router } = require("express");
const {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiry.controller");
const { validateEnquiry } = require("../validations/enquiry.validation");

const router = Router();

// Submit General Enquiry (Client)
router.post("/", validateEnquiry, createEnquiry);

// Get all enquiries (Admin)
router.get("/", getAllEnquiries);

// Update enquiry status (Admin)
router.patch("/:id/status", updateEnquiryStatus);

// Delete enquiry (Admin)
router.delete("/:id", deleteEnquiry);

module.exports = router;