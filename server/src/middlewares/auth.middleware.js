const jwt = require("jsonwebtoken");
const { AdminUser } = require("../models");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Middleware to verify JWT from cookies (or Bearer Authorization header)
 */
const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.cookies?.shs_admin_token ||
    req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    throw new ApiError(
      401,
      "Unauthorized request: Authentication cookie or token missing"
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(
      401,
      "Unauthorized request: Invalid or expired session"
    );
  }

  const user = await AdminUser.findById(decoded.id).select("-password_hash");

  if (!user) {
    throw new ApiError(401, "Unauthorized request: User no longer exists");
  }

  if (!user.is_active) {
    throw new ApiError(
      403,
      "Account deactivated. Please contact the administrator."
    );
  }

  req.user = user;
  next();
});

/**
 * Middleware to enforce Role-Based Access Control (RBAC)
 * @param  {...string} allowedRoles
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied: Role '${req.user?.role}' is not authorized to access this resource`
      );
    }
    next();
  };
};

module.exports = { verifyJWT, authorizeRoles };
