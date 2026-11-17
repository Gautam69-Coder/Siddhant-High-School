
const { Router } = require("express");

const authRoutes = require("./auth.routes");
const admissionRoutes = require("./admission.routes");
const enquiryRoutes = require("./enquiry.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/admissions", admissionRoutes);
router.use("/enquiries", enquiryRoutes);

module.exports = route