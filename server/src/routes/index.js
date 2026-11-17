
const { Router } = require("express");

const authRoutes = require("./auth.routes");
const admissionRoutes = require("./admission.routes");

console.log("Auth routes:", typeof authRoutes);
console.log("Admission routes:", typeof admissionRoutes);

const router = Router();

router.use("/auth", authRoutes);
router.use("/admissions", admissionRoutes);

module.exports = router;