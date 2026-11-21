const { Router } = require("express");
const {
  uploadGalleryMedia,
  getAllGalleryMedia,
  getGalleryMediaById,
  createGalleryMediaDirect,
  updateGalleryMedia,
  deleteGalleryMedia,
  bulkDeleteGalleryMedia,
} = require("../controllers/galleryMedia.controller");
const {
  validateUpdateGalleryMedia,
} = require("../validations/galleryMedia.validation");
const galleryUpload = require("../middlewares/galleryUpload.middleware");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth.middleware");
const { ROLES } = require("../constants/enums");

const router = Router();

const canManageGallery = [
  verifyJWT,
  authorizeRoles(ROLES.SUPER_ADMIN, ROLES.CMS_EDITOR),
];

// Public: Get all gallery items
router.get("/", getAllGalleryMedia);

// Public: Get single gallery item
router.get("/:id", getGalleryMediaById);

// Protected: Bulk or single file upload (supports field names "images", "files", or single "image")
router.post(
  "/upload",
  ...canManageGallery,
  galleryUpload.fields([
    { name: "images", maxCount: 20 },
    { name: "files", maxCount: 20 },
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  (req, res, next) => {
    // Flatten uploaded files to req.files array for the controller
    const allFiles = [
      ...(req.files?.images || []),
      ...(req.files?.files || []),
      ...(req.files?.image || []),
      ...(req.files?.file || []),
    ];
    req.files = allFiles;
    next();
  },
  uploadGalleryMedia
);

// Protected: Direct item creation (external URL)
router.post("/", ...canManageGallery, createGalleryMediaDirect);

// Protected: Update item metadata
router.patch(
  "/:id",
  ...canManageGallery,
  validateUpdateGalleryMedia,
  updateGalleryMedia
);

router.put(
  "/:id",
  ...canManageGallery,
  validateUpdateGalleryMedia,
  updateGalleryMedia
);

// Protected: Delete single item
router.delete("/:id", ...canManageGallery, deleteGalleryMedia);

// Protected: Bulk delete items
router.post("/bulk-delete", ...canManageGallery, bulkDeleteGalleryMedia);

module.exports = router;
