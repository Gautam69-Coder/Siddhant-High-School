const { SchoolSettings } = require("../models");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const PUBLIC_SETTINGS_DEFAULTS = {
  school_name: "Siddhant High School",
  society_name: "Shubham Education & Welfare Society",
  academic_year: "2026-2027",
  contact_email: null,
  epabx_lines: null,
  campus_address: null,
  office_hours: "8:00 AM – 2:00 PM",
  affiliation_number: null,
  map_embed_url: null,
};

const pickPublicSettings = (doc) => ({
  school_name: doc?.school_name || PUBLIC_SETTINGS_DEFAULTS.school_name,
  society_name: doc?.society_name || PUBLIC_SETTINGS_DEFAULTS.society_name,
  academic_year: doc?.academic_year || PUBLIC_SETTINGS_DEFAULTS.academic_year,
  contact_email: doc?.contact_email || null,
  epabx_lines: doc?.epabx_lines || null,
  campus_address: doc?.campus_address || null,
  office_hours: doc?.office_hours || PUBLIC_SETTINGS_DEFAULTS.office_hours,
  affiliation_number: doc?.affiliation_number || null,
  map_embed_url: doc?.map_embed_url || null,
});

/**
 * Public: Get school settings (contact info, office hours, academic year, branding)
 */
const getPublicSchoolSettings = asyncHandler(async (req, res) => {
  const settings = await SchoolSettings.findOne().sort({ updated_at: -1 });
  return res.status(200).json(
    new ApiResponse(200, pickPublicSettings(settings), "School settings retrieved successfully")
  );
});

/**
 * Protected: Create or update school settings
 */
const upsertSchoolSettings = asyncHandler(async (req, res) => {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : null;
  if (!body) {
    throw new ApiError(400, "Request body must be a JSON object");
  }

  const allowedStringFields = [
    "school_name",
    "society_name",
    "academic_year",
    "contact_email",
    "epabx_lines",
    "affiliation_number",
    "campus_address",
    "office_hours",
    "map_embed_url",
  ];

  const updates = { updated_by: req.user._id };

  for (const field of allowedStringFields) {
    if (body[field] !== undefined) {
      if (body[field] !== null && typeof body[field] !== "string") {
        throw new ApiError(400, `${field} must be text`);
      }
      const trimmed = body[field] === null ? null : body[field].trim() || null;
      if ((field === "school_name" || field === "academic_year") && !trimmed) {
        throw new ApiError(400, `${field} cannot be empty`);
      }
      updates[field] = trimmed;
    }
  }

  if (body.intake_limit !== undefined) {
    const parsedLimit = Number(body.intake_limit);
    if (!Number.isFinite(parsedLimit) || parsedLimit < 0) {
      throw new ApiError(400, "intake_limit must be a non-negative number");
    }
    updates.intake_limit = parsedLimit;
  }

  if (body.admissions_deadline !== undefined) {
    if (body.admissions_deadline === null || body.admissions_deadline === "") {
      updates.admissions_deadline = null;
    } else {
      const parsedDate = new Date(body.admissions_deadline);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new ApiError(400, "admissions_deadline must be a valid date");
      }
      updates.admissions_deadline = parsedDate;
    }
  }

  const existing = await SchoolSettings.findOne().sort({ updated_at: -1 });
  const saved = existing
    ? await SchoolSettings.findByIdAndUpdate(
        existing._id,
        { $set: updates },
        { returnDocument: "after", runValidators: true }
      )
    : await SchoolSettings.create(updates);

  return res.status(200).json(
    new ApiResponse(200, saved, "School settings updated successfully")
  );
});

module.exports = {
  getPublicSchoolSettings,
  upsertSchoolSettings,
};
