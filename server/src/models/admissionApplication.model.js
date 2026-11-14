const mongoose = require("mongoose");
const { ADMISSION_STATUS, GENDERS } = require("../constants/enums");

const admissionApplicationSchema = new mongoose.Schema(
  {
    application_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    student_name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: GENDERS,
      required: true,
    },
    grade_applying: {
      type: String,
      required: [true, "Grade applying for is required"],
      trim: true,
    },
    previous_school: {
      type: String,
      trim: true,
      default: null,
    },
    parent_name: {
      type: String,
      required: [true, "Parent name is required"],
      trim: true,
    },
    parent_email: {
      type: String,
      required: [true, "Parent email is required"],
      lowercase: true,
      trim: true,
    },
    parent_phone: {
      type: String,
      required: [true, "Parent phone is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(ADMISSION_STATUS),
      default: ADMISSION_STATUS.PENDING,
      index: true,
    },
    internal_notes: {
      type: String,
      default: null,
    },
    reviewed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
  },
  {
    timestamps: { createdAt: "submitted_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("AdmissionApplication", admissionApplicationSchema);
