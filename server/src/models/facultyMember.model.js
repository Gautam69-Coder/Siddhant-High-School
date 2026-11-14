const mongoose = require("mongoose");
const { FACULTY_DEPARTMENTS } = require("../constants/enums");

const facultyMemberSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    department: {
      type: String,
      enum: FACULTY_DEPARTMENTS,
      required: true,
    },
    qualifications: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    avatar_url: {
      type: String,
      default: null,
    },
    display_order: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("FacultyMember", facultyMemberSchema);
