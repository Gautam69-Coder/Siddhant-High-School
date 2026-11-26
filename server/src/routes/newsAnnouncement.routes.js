const { Router } = require("express");
const {
  createNewsAnnouncement,
  getAllNewsAnnouncements,
  getNewsAnnouncementById,
  updateNewsAnnouncement,
  deleteNewsAnnouncement,
} = require("../controllers/newsAnnouncement.controller");
const {
  validateCreateNewsAnnouncement,
  validateUpdateNewsAnnouncement,
} = require("../validations/newsAnnouncement.validation");
const { verifyJWT, optionalVerifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { requireCsrfToken } = require("../middlewares/csrf.middleware");
const { ROLES } = require("../constants/enums");

const router = Router();

const canManageNews = [
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.CMS_EDITOR),
  requireCsrfToken,
];

// Public: Get all announcements
router.get("/", optionalVerifyJWT, getAllNewsAnnouncements);

// Public: Get single announcement
router.get("/:id", optionalVerifyJWT, getNewsAnnouncementById);

// Protected: Create new announcement
router.post(
  "/",
  ...canManageNews,
  validateCreateNewsAnnouncement,
  createNewsAnnouncement
);

// Protected: Update announcement
router.patch(
  "/:id",
  ...canManageNews,
  validateUpdateNewsAnnouncement,
  updateNewsAnnouncement
);

router.put(
  "/:id",
  ...canManageNews,
  validateUpdateNewsAnnouncement,
  updateNewsAnnouncement
);

// Protected: Delete announcement
router.delete("/:id", ...canManageNews, deleteNewsAnnouncement);

module.exports = router;
