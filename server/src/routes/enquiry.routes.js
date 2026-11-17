const { Router } = require("express");
const { createEnquiry } = require("../controllers/enquiry.controller");
const { validateEnquiry } = require("../validations/enquiry.validation");

const router = Router();

// Submit General Enquiry
router.post("/", validateEnquiry, createEnquiry);

module.exports = router;