const { Router } = require("express");
const {
  getPublicSchoolSettings,
  upsertSchoolSettings,
} = require("../controllers/settings.controller");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { requireCsrfToken } = require("../middlewares/csrf.middleware");
const { ROLES } = require("../constants/enums");

const router = Router();

router.get("/", getPublicSchoolSettings);

router.put(
  "/",
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.CMS_EDITOR),
  requireCsrfToken,
  upsertSchoolSettings
);

module.exports = router;
