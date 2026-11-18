
const { Router } = require("express");

const authRoutes = require("./auth.routes");
const admissionRoutes = require("./admission.routes");
const enquiryRoutes = require("./enquiry.routes");
const facultyRoutes = require("./faculty.routes");
const calendarEventRoutes = require("./calendarEvent.routes");
const router = Router();

router.use("/auth", authRoutes);
router.use("/admissions", admissionRoutes);
router.use("/enquiries", enquiryRoutes);
router.use("/faculty", facultyRoutes);
router.use("/calendar-events", calendarEventRoutes);
module.exports = router;
