const mongoose = require("mongoose");

const schoolSettingsSchema = new mongoose.Schema(
  {
    school_name: {
      type: String,
      required: true,
      default: "Siddhant High School",
      trim: true,
    },
    society_name: {
      type: String,
      trim: true,
      default: null,
    },
    academic_year: {
      type: String,
      required: true,
      default: "2026-2027",
    },
    intake_limit: {
      type: Number,
      default: 200,
    },
    admissions_deadline: {
      type: Date,
      default: null,
    },
    contact_email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    epabx_lines: {
      type: String,
      default: null,
    },
    affiliation_number: {
      type: String,
      default: null,
    },
    campus_address: {
      type: String,
      default: null,
    },
    office_hours: {
      type: String,
      trim: true,
      default: "8:00 AM – 2:00 PM",
    },
    map_embed_url: {
      type: String,
      trim: true,
      default: null,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("SchoolSettings", schoolSettingsSchema);
