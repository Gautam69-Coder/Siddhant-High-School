const { Router } = require("express");

const authRoutes = require("./auth.routes");
const admissionRoutes = require("./admission.routes");
const enquiryRoutes = require("./enquiry.routes");
const facultyRoutes = require("./faculty.routes");
const calendarEventRoutes = require("./calendarEvent.routes");
const newsAnnouncementRoutes = require("./newsAnnouncement.routes");
const galleryMediaRoutes = require("./galleryMedia.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/admissions", admissionRoutes);
router.use("/enquiries", enquiryRoutes);
router.use("/faculty", facultyRoutes);
router.use("/calendar-events", calendarEventRoutes);
router.use("/news-announcements", newsAnnouncementRoutes);
router.use("/news", newsAnnouncementRoutes); // Convenient alias
router.use("/gallery", galleryMediaRoutes);

module.exports = router;
