
const { Router } = require("express");

const {
  createCalendarEvent,
  getAllCalendarEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
} = require("../controllers/calendarEvent.controller");

const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants/enums");

const router = Router();

const canManageEvents = [
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.CMS_EDITOR),
];

// Public: Get all calendar events
router.get("/", getAllCalendarEvents);

// Protected: Create event
router.post("/", ...canManageEvents, createCalendarEvent);

// Protected: Update event
router.patch("/:id", ...canManageEvents, updateCalendarEvent);

// Protected: Delete event
router.delete("/:id", ...canManageEvents, deleteCalendarEvent);

module.exports = router;
