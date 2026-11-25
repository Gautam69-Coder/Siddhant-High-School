const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { GalleryMedia, AuditLog } = require("../models");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { AUDIT_ACTIONS, GALLERY_CATEGORIES } = require("../constants/enums");
const { escapeRegexLiteral, getSearchTerm, parsePositiveInteger } = require("../utils/searchText");

/**
 * Upload single or multiple images to Campus Media Gallery
 */
const uploadGalleryMedia = asyncHandler(async (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);

  if (!files || files.length === 0) {
    throw new ApiError(400, "Please provide at least one image file to upload");
  }

  const { category = "Campus", tags } = req.body;
  const parsedTags = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
    ? tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const validCategory = GALLERY_CATEGORIES.includes(category)
    ? category
    : "Campus";

  const mediaRecordsToInsert = files.map((file, index) => {
    // Generate clean human-readable title from original filename
    const ext = path.extname(file.originalname);
    const rawTitle = path
      .basename(file.originalname, ext)
      .replace(/[_-]+/g, " ")
      .trim();
    const formattedTitle =
      rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1) || "Campus Photograph";

    return {
      title: req.body.title && files.length === 1 ? req.body.title.trim() : formattedTitle,
      category: validCategory,
      media_type: "image",
      media_url: `/uploads/gallery/${file.filename}`,
      file_size: file.size,
      mime_type: file.mimetype,
      tags: parsedTags,
      display_order: index,
      uploaded_by: req.user._id,
    };
  });

  const createdMedia = await GalleryMedia.insertMany(mediaRecordsToInsert);

  // Write audit log
  try {
    await AuditLog.create({
      admin_user_id: req.user._id,
      action: AUDIT_ACTIONS.MEDIA_UPLOAD,
      target_entity: "GalleryMedia",
      target_id: createdMedia[0]?._id?.toString() || "bulk",
      metadata: {
        count: createdMedia.length,
        category: validCategory,
        files: createdMedia.map((m) => ({ id: m._id, title: m.title, url: m.media_url })),
      },
      ip_address: req.ip || req.connection?.remoteAddress || null,
    });
  } catch (auditErr) {
    console.warn("Notice: Failed to write audit log for media upload:", auditErr.message);
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      createdMedia,
      `Successfully uploaded ${createdMedia.length} image(s)`
    )
  );
});

/**
 * Get all gallery media items (supports category, search, and pagination)
 */
const getAllGalleryMedia = asyncHandler(async (req, res) => {
  const { category, search, limit, page = 1 } = req.query;

  const query = {};
  const searchTerm = getSearchTerm(search);
  if (searchTerm === null) {
    throw new ApiError(400, "Search must be text no longer than 100 characters");
  }

  if (category !== undefined && (typeof category !== "string" || (category !== "All" && !GALLERY_CATEGORIES.includes(category)))) {
    throw new ApiError(400, "Invalid gallery category");
  }
  if (category && category !== "All") {
    query.category = category;
  }

  if (searchTerm) {
    const safeSearch = escapeRegexLiteral(searchTerm);
    query.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { tags: { $in: [new RegExp(safeSearch, "i")] } },
    ];
  }

  let dbQuery = GalleryMedia.find(query)
    .populate("uploaded_by", "full_name")
    .sort({ display_order: 1, created_at: -1 });

  if (limit !== undefined) {
    const parsedLimit = parsePositiveInteger(limit);
    const parsedPage = parsePositiveInteger(page);
    if (!parsedLimit || parsedLimit > 100 || !parsedPage) {
      throw new ApiError(400, "Pagination values are invalid");
    }
    dbQuery = dbQuery.skip((parsedPage - 1) * parsedLimit).limit(parsedLimit);
  }

  const [mediaList, total] = await Promise.all([
    dbQuery,
    GalleryMedia.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(200, mediaList, "Gallery media retrieved successfully", {
      total,
      count: mediaList.length,
    })
  );
});

/**
 * Get single gallery media item by ID
 */
const getGalleryMediaById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid media ID");
  }

  const media = await GalleryMedia.findById(id).populate(
    "uploaded_by",
    "full_name"
  );

  if (!media) {
    throw new ApiError(404, "Gallery media item not found");
  }

  return res.status(200).json(
    new ApiResponse(200, media, "Gallery media item retrieved successfully")
  );
});

/**
 * Create gallery item with direct URL (e.g. external asset or CDN link)
 */
const createGalleryMediaDirect = asyncHandler(async (req, res) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new ApiError(400, "Request body must be a JSON object");
  }
  const {
    title,
    category = "Campus",
    media_url,
    thumbnail_url,
    tags,
    display_order = 0,
  } = req.body;

  if (typeof title !== "string" || !title.trim() || typeof media_url !== "string" || !media_url.trim()) {
    throw new ApiError(400, "Title and media URL are required");
  }
  if (thumbnail_url !== undefined && thumbnail_url !== null && typeof thumbnail_url !== "string") {
    throw new ApiError(400, "Thumbnail URL must be text");
  }
  if (typeof category !== "string" || !GALLERY_CATEGORIES.includes(category)) {
    throw new ApiError(400, "Invalid gallery category");
  }
  const isSafeMediaUrl = (value) => {
    if (value.startsWith("/uploads/gallery/")) {
      return /^\/uploads\/gallery\/[a-zA-Z0-9_.-]+$/.test(value);
    }
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
    } catch {
      return false;
    }
  };
  if (!isSafeMediaUrl(media_url) || (thumbnail_url && !isSafeMediaUrl(thumbnail_url))) {
    throw new ApiError(400, "Media URLs must use HTTP, HTTPS, or a local gallery path");
  }
  if (tags !== undefined && (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string"))) {
    throw new ApiError(400, "Tags must be an array of text values");
  }
  const parsedDisplayOrder = Number(display_order);
  if (!Number.isFinite(parsedDisplayOrder)) {
    throw new ApiError(400, "Display order must be a finite number");
  }

  const media = await GalleryMedia.create({
    title: title.trim(),
    category,
    media_type: "image",
    media_url: media_url.trim(),
    thumbnail_url: thumbnail_url?.trim() || null,
    tags: Array.isArray(tags) ? tags : [],
    display_order: parsedDisplayOrder,
    uploaded_by: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(201, media, "Gallery item created successfully")
  );
});

/**
 * Update gallery media metadata
 */
const updateGalleryMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid media ID");
  }

  const { title, category, tags, display_order } = req.body;
  const updates = {};

  if (title !== undefined) {
    if (!title.trim()) throw new ApiError(400, "Title cannot be empty");
    updates.title = title.trim();
  }

  if (category !== undefined) {
    if (!GALLERY_CATEGORIES.includes(category)) {
      throw new ApiError(400, "Invalid gallery category");
    }
    updates.category = category;
  }

  if (tags !== undefined) {
    updates.tags = Array.isArray(tags) ? tags : [];
  }

  if (display_order !== undefined) {
    updates.display_order = Number(display_order);
  }

  const media = await GalleryMedia.findByIdAndUpdate(
    id,
    { $set: updates },
    { returnDocument: "after", runValidators: true }
  ).populate("uploaded_by", "full_name");

  if (!media) {
    throw new ApiError(404, "Gallery media item not found");
  }

  return res.status(200).json(
    new ApiResponse(200, media, "Gallery item updated successfully")
  );
});

/**
 * Helper to delete physical file from disk if stored locally
 */
const removeLocalFile = async (mediaUrl) => {
  if (typeof mediaUrl === "string" && mediaUrl.startsWith("/uploads/gallery/")) {
    const filename = path.basename(mediaUrl);
    const absolutePath = path.join(__dirname, "../../uploads/gallery", filename);
    try {
      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
      }
    } catch (err) {
      console.warn(`Could not remove physical file ${absolutePath}:`, err.message);
    }
  }
};

/**
 * Delete single gallery media item (removes DB record and file from disk)
 */
const deleteGalleryMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid media ID");
  }

  const media = await GalleryMedia.findById(id);

  if (!media) {
    throw new ApiError(404, "Gallery media item not found");
  }

  // Remove physical file from disk
  await removeLocalFile(media.media_url);

  // Remove DB record
  await GalleryMedia.findByIdAndDelete(id);

  // Write audit log
  try {
    await AuditLog.create({
      admin_user_id: req.user._id,
      action: AUDIT_ACTIONS.MEDIA_DELETE,
      target_entity: "GalleryMedia",
      target_id: id,
      metadata: { deleted_title: media.title, url: media.media_url },
      ip_address: req.ip || req.connection?.remoteAddress || null,
    });
  } catch (auditErr) {
    console.warn("Notice: Failed to write audit log for media delete:", auditErr.message);
  }

  return res.status(200).json(
    new ApiResponse(200, null, "Gallery item deleted successfully")
  );
});

/**
 * Bulk delete gallery media items
 */
const bulkDeleteGalleryMedia = asyncHandler(async (req, res) => {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
  const { ids } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "Please provide an array of media IDs to delete");
  }

  const validIds = ids.filter((id) => mongoose.isValidObjectId(id));
  if (validIds.length === 0) {
    throw new ApiError(400, "No valid media IDs provided");
  }

  const mediaRecords = await GalleryMedia.find({ _id: { $in: validIds } });

  // Clean up physical files
  await Promise.all(mediaRecords.map((m) => removeLocalFile(m.media_url)));

  // Delete records
  const result = await GalleryMedia.deleteMany({ _id: { $in: validIds } });

  return res.status(200).json(
    new ApiResponse(
      200,
      { deletedCount: result.deletedCount },
      `Successfully deleted ${result.deletedCount} gallery item(s)`
    )
  );
});

module.exports = {
  uploadGalleryMedia,
  getAllGalleryMedia,
  getGalleryMediaById,
  createGalleryMediaDirect,
  updateGalleryMedia,
  deleteGalleryMedia,
  bulkDeleteGalleryMedia,
};
