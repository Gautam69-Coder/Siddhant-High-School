const { Router } = require("express");
const {
  login,
  register,
  getCurrentUser,
  logout,
  changePassword,
} = require("../controllers/auth.controller");
const { verifyJWT } = require("../middlewares/auth.middleware");
const { authLimiter } = require("../middlewares/rateLimiter.middleware");
const {
  validateLogin,
  validateRegister,
  validateChangePassword,
} = require("../validations/auth.validation");

const router = Router();

// Public / Rate-limited routes
router.post("/login", authLimiter, validateLogin, login);
router.post("/register", authLimiter, validateRegister, register);

// Protected routes (reads HTTP-only cookie or Bearer token)
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getCurrentUser);
router.put(
  "/change-password",
  verifyJWT,
  validateChangePassword,
  changePassword
);

module.exports = router;
