const mongoose = require("mongoose");

const applicationDocumentSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdmissionApplication",
      required: true,
      index: true,
    },
    document_type: {
      type: String,
      required: true,
      trim: true,
    },
    file_name: {
      type: String,
      required: true,
      trim: true,
    },
    file_url: {
      type: String,
      required: true,
      trim: true,
    },
    file_size_kb: {
      type: Number,
      default: null,
    },
    mime_type: {
      type: String,
      default: null,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    verified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
    verified_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("ApplicationDocument", applicationDocumentSchema);
