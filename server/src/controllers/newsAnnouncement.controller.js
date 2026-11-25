const mongoose = require("mongoose");
const { NewsAnnouncement, AuditLog } = require("../models");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { AUDIT_ACTIONS, NEWS_STATUS, NEWS_CATEGORIES, ROLES } = require("../constants/enums");
const { escapeRegexLiteral, getSearchTerm, parsePositiveInteger } = require("../utils/searchText");

const canViewUnpublished = (user) =>
  user && [ROLES.SUPER_ADMIN, ROLES.CMS_EDITOR].includes(user.role);

/**
 * Create a new news/announcement
 */
const createNewsAnnouncement = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    category,
    is_urgent = false,
    is_pinned = false,
    status = NEWS_STATUS.PUBLISHED,
    publish_date,
  } = req.body;

  const announcement = await NewsAnnouncement.create({
    title: title.trim(),
    content: (content && content.trim()) || title.trim(),
    category,
    is_urgent: Boolean(is_urgent),
    is_pinned: Boolean(is_pinned),
    status,
    publish_date: publish_date ? new Date(publish_date) : new Date(),
    author_id: req.user._id,
  });

  // Record audit log
  try {
    await AuditLog.create({
      admin_user_id: req.user._id,
      action: AUDIT_ACTIONS.CMS_PUBLISH,
      target_entity: "NewsAnnouncement",
      target_id: announcement._id.toString(),
      metadata: {
        title: announcement.title,
        category: announcement.category,
        is_urgent: announcement.is_urgent,
        status: announcement.status,
      },
      ip_address: req.ip || req.connection?.remoteAddress || null,
    });
  } catch (auditErr) {
    console.warn("Notice: Failed to write audit log for news creation:", auditErr.message);
  }

  return res.status(201).json(
    new ApiResponse(201, announcement, "Announcement published successfully")
  );
});

/**
 * Get all announcements (supports category, urgent, search, status filtering)
 */
const getAllNewsAnnouncements = asyncHandler(async (req, res) => {
  const {
    category,
    is_urgent,
    status,
    search,
    limit,
    page = 1,
  } = req.query;

  const query = {};
  const searchTerm = getSearchTerm(search);
  if (searchTerm === null) {
    throw new ApiError(400, "Search must be text no longer than 100 characters");
  }

  if (category !== undefined && (typeof category !== "string" || (category !== "All" && !NEWS_CATEGORIES.includes(category)))) {
    throw new ApiError(400, "Invalid announcement category");
  }
  if (category && category !== "All") {
    query.category = category;
  }

  if (is_urgent !== undefined) {
    if (is_urgent !== "true" && is_urgent !== "false") {
      throw new ApiError(400, "is_urgent must be true or false");
    }
    query.is_urgent = is_urgent === "true";
  }

  if (canViewUnpublished(req.user) && status !== undefined) {
    if (typeof status !== "string" || !Object.values(NEWS_STATUS).includes(status)) {
      throw new ApiError(400, "Invalid announcement status");
    }
    query.status = status;
  } else if (!canViewUnpublished(req.user)) {
    query.status = NEWS_STATUS.PUBLISHED;
  }

  if (searchTerm) {
    const safeSearch = escapeRegexLiteral(searchTerm);
    query.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { content: { $regex: safeSearch, $options: "i" } },
    ];
  }

  let dbQuery = NewsAnnouncement.find(query)
    .populate("author_id", "full_name")
    .sort({ is_urgent: -1, publish_date: -1, created_at: -1 });

  if (limit !== undefined) {
    const parsedLimit = parsePositiveInteger(limit);
    const parsedPage = parsePositiveInteger(page);
    if (!parsedLimit || parsedLimit > 100 || !parsedPage) {
      throw new ApiError(400, "Pagination values are invalid");
    }
    dbQuery = dbQuery.skip((parsedPage - 1) * parsedLimit).limit(parsedLimit);
  }

  const [announcements, total] = await Promise.all([
    dbQuery,
    NewsAnnouncement.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      announcements,
      "Announcements retrieved successfully",
      { total, count: announcements.length }
    )
  );
});

/**
 * Get single announcement by ID
 */
const getNewsAnnouncementById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid announcement ID");
  }

  const query = { _id: id };
  if (!canViewUnpublished(req.user)) query.status = NEWS_STATUS.PUBLISHED;
  const announcement = await NewsAnnouncement.findOne(query).populate(
    "author_id",
    "full_name"
  );

  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  return res.status(200).json(
    new ApiResponse(200, announcement, "Announcement retrieved successfully")
  );
});

/**
 * Update announcement
 */
const updateNewsAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid announcement ID");
  }

  const {
    title,
    content,
    category,
    is_urgent,
    is_pinned,
    status,
    publish_date,
  } = req.body;

  const updates = {};

  if (title !== undefined) {
    if (!title.trim()) throw new ApiError(400, "Title cannot be empty");
    updates.title = title.trim();
  }

  if (content !== undefined) {
    updates.content = content.trim();
  }

  if (category !== undefined) {
    updates.category = category;
  }

  if (is_urgent !== undefined) {
    updates.is_urgent = Boolean(is_urgent);
  }

  if (is_pinned !== undefined) {
    updates.is_pinned = Boolean(is_pinned);
  }

  if (status !== undefined) {
    updates.status = status;
  }

  if (publish_date !== undefined) {
    updates.publish_date = new Date(publish_date);
  }

  const announcement = await NewsAnnouncement.findByIdAndUpdate(
    id,
    { $set: updates },
    { returnDocument: "after", runValidators: true }
  ).populate("author_id", "full_name");

  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  // Audit log
  try {
    await AuditLog.create({
      admin_user_id: req.user._id,
      action: AUDIT_ACTIONS.CMS_PUBLISH,
      target_entity: "NewsAnnouncement",
      target_id: announcement._id.toString(),
      metadata: { action: "UPDATE", updates },
      ip_address: req.ip || req.connection?.remoteAddress || null,
    });
  } catch (auditErr) {
    console.warn("Notice: Failed to write audit log for news update:", auditErr.message);
  }

  return res.status(200).json(
    new ApiResponse(200, announcement, "Announcement updated successfully")
  );
});

/**
 * Delete announcement
 */
const deleteNewsAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid announcement ID");
  }

  const announcement = await NewsAnnouncement.findByIdAndDelete(id);

  if (!announcement) {
    throw new ApiError(404, "Announcement not found");
  }

  // Audit log
  try {
    await AuditLog.create({
      admin_user_id: req.user._id,
      action: AUDIT_ACTIONS.CMS_DELETE,
      target_entity: "NewsAnnouncement",
      target_id: id,
      metadata: { deleted_title: announcement.title },
      ip_address: req.ip || req.connection?.remoteAddress || null,
    });
  } catch (auditErr) {
    console.warn("Notice: Failed to write audit log for news deletion:", auditErr.message);
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Announcement deleted successfully")
  );
});

module.exports = {
  createNewsAnnouncement,
  getAllNewsAnnouncements,
  getNewsAnnouncementById,
  updateNewsAnnouncement,
  deleteNewsAnnouncement,
};
