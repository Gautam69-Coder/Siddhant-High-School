const mongoose = require("mongoose");
const { NEWS_CATEGORIES, NEWS_STATUS } = require("../constants/enums");

const newsAnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    category: {
      type: String,
      enum: NEWS_CATEGORIES,
      required: true,
    },
    is_urgent: {
      type: Boolean,
      default: false,
    },
    is_pinned: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(NEWS_STATUS),
      default: NEWS_STATUS.DRAFT,
      index: true,
    },
    publish_date: {
      type: Date,
      default: Date.now,
    },
    author_id: {
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

module.exports = mongoose.model("NewsAnnouncement", newsAnnouncementSchema);
