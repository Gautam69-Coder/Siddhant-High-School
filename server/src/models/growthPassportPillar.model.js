const mongoose = require("mongoose");
const { WINGS, PILLAR_NAMES } = require("../constants/enums");

const growthPassportPillarSchema = new mongoose.Schema(
  {
    wing: {
      type: String,
      enum: WINGS,
      required: true,
    },
    pillar_name: {
      type: String,
      enum: PILLAR_NAMES,
      required: true,
    },
    benchmark_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    badge_title: {
      type: String,
      required: true,
      trim: true,
    },
    benchmark_details: {
      type: String,
      default: null,
    },
    accent_color: {
      type: String,
      default: "#4F46E5",
    },
    mentor_faculty_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyMember",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("GrowthPassportPillar", growthPassportPillarSchema);
