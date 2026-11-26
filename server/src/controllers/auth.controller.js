const { AdminUser, AuditLog } = require("../models");
const { ROLES } = require("../constants/enums");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { clearCsrfCookie, setCsrfCookie } = require("../middlewares/csrf.middleware");

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

/**
 * @desc    Login Admin & set HTTP-only cookie
 * @route   POST /api/v1/auth/login
 * @access  Public (Rate limited)
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();
  const user = await AdminUser.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(401, "Invalid institutional email or password");
  }

  if (!user.is_active) {
    throw new ApiError(401, "Invalid institutional email or password");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid institutional email or password");
  }

  // Update last login timestamp
  user.last_login_at = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate JWT Token
  const token = user.generateToken();

  // Create audit log entry
  try {
    await AuditLog.create({
      admin_user_id: user._id,
      action: "LOGIN",
      target_entity: "AdminUser",
      target_id: user._id.toString(),
      metadata: { email: user.email, role: user.role },
      ip_address: req.ip || req.connection?.remoteAddress || null,
    });
  } catch (auditErr) {
    // Non-blocking for login flow
    console.error("Audit log error on login:", auditErr.message);
  }

  // Exclude password_hash from response
  const userResponse = user.toObject();
  delete userResponse.password_hash;

  setCsrfCookie(res, token);
  return res
    .status(200)
    .cookie("accessToken", token, getCookieOptions())
    .json(
      new ApiResponse(
        200,
        { user: userResponse, token },
        "Logged in successfully"
      )
    );
});

/**
 * @desc    Register a staff account (Super Admin only)
 * @route   POST /api/v1/auth/register
 * @access  Private (Super Admin only)
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, full_name, role } = req.body;
  const hasRequestedRole = Object.prototype.hasOwnProperty.call(req.body, "role");
  const assignedRole = hasRequestedRole ? role : ROLES.ADMISSIONS_OFFICER;

  if (!Object.values(ROLES).includes(assignedRole)) {
    throw new ApiError(
      400,
      "Validation failed",
      [`Role must be one of: ${Object.values(ROLES).join(", ")}`]
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await AdminUser.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "An admin account with this email already exists");
  }

  const newUser = await AdminUser.create({
    email: normalizedEmail,
    password_hash: password, // pre-save hook will hash this
    full_name: full_name.trim(),
    role: assignedRole,
  });

  const createdUser = newUser.toObject();
  delete createdUser.password_hash;

  return res.status(201).json(
    new ApiResponse(
      201,
      { user: createdUser },
      "Staff account created successfully"
    )
  );
});

/**
 * @desc    Get authenticated admin profile
 * @route   GET /api/v1/auth/me
 * @access  Private (Cookie or Token required)
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        req.user,
        "User profile retrieved successfully"
      )
    );
});

/**
 * @desc    Logout admin & clear HTTP-only cookie
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  clearCsrfCookie(res);
  return res
    .status(200)
    .clearCookie("accessToken", getCookieOptions())
    .clearCookie("shs_admin_token", getCookieOptions())
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

/**
 * @desc    Change admin password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await AdminUser.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isCurrentValid = await user.isPasswordCorrect(currentPassword);
  if (!isCurrentValid) {
    throw new ApiError(400, "Current password does not match");
  }

  user.password_hash = newPassword; // pre-save hook will hash this
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});

module.exports = {
  login,
  register,
  getCurrentUser,
  logout,
  changePassword,
};
