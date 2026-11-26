const { Router } = require("express");
const {
  login,
  register,
  getCurrentUser,
  logout,
  changePassword,
} = require("../controllers/auth.controller");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { getCsrfToken, requireCsrfToken } = require("../middlewares/csrf.middleware");
const { ROLES } = require("../constants/enums");
const { authLimiter } = require("../middlewares/rateLimiter.middleware");
const {
  validateLogin,
  validateRegister,
  validateChangePassword,
} = require("../validations/auth.validation");

const router = Router();

// Public login; staff registration requires an authenticated Super Admin.
router.post("/login", authLimiter, validateLogin, login);
router.post(
  "/register",
  authLimiter,
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN),
  requireCsrfToken,
  validateRegister,
  register
);

// Protected routes (reads HTTP-only cookie or Bearer token)
router.get("/csrf", verifyJWT, getCsrfToken);
router.post("/logout", verifyJWT, requireCsrfToken, logout);
router.get("/me", verifyJWT, getCurrentUser);
router.put(
  "/change-password",
  verifyJWT,
  requireCsrfToken,
  validateChangePassword,
  changePassword
);

module.exports = router;
