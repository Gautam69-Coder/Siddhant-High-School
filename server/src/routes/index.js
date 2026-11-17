const { Router } = require("express");
const authRoutes = require("./auth.routes");
const enquiryRoutes = require("./enquiry.routes");

const router = Router();

// Mount Auth routes under /api/v1/auth
router.use("/auth", authRoutes);
router.use("/enquiries", enquiryRoutes);

module.exports = router;
