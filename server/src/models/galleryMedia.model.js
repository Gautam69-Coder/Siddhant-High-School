const mongoose = require("mongoose");
const { GALLERY_CATEGORIES, MEDIA_TYPES } = require("../constants/enums");

const galleryMediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: GALLERY_CATEGORIES,
      default: "Campus",
      required: true,
    },
    media_type: {
      type: String,
      enum: MEDIA_TYPES,
      default: "image",
    },
    media_url: {
      type: String,
      required: [true, "Media URL is required"],
      trim: true,
    },
    thumbnail_url: {
      type: String,
      trim: true,
      default: null,
    },
    file_size: {
      type: Number,
      default: 0,
    },
    mime_type: {
      type: String,
      default: "image/jpeg",
    },
    image_data: {
      type: Buffer,
      default: null,
      select: false,
    },
    has_binary: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    display_order: {
      type: Number,
      default: 0,
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

galleryMediaSchema.index({ category: 1, display_order: 1, created_at: -1 });

module.exports = mongoose.model("GalleryMedia", galleryMediaSchema);
