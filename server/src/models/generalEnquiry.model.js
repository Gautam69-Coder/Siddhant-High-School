const mongoose = require("mongoose");
const { ENQUIRY_CATEGORIES, ENQUIRY_STATUS } = require("../constants/enums");

const generalEnquirySchema = new mongoose.Schema(
  {
    parent_name: {
      type: String,
      required: [true, "Parent name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    grade_interested: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      enum: ENQUIRY_CATEGORIES,
      required: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    status: {
      type: String,
      enum: Object.values(ENQUIRY_STATUS),
      default: ENQUIRY_STATUS.PENDING,
      index: true,
    },
    response_notes: {
      type: String,
      default: null,
    },
    handled_by: {
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

module.exports = mongoose.model("GeneralEnquiry", generalEnquirySchema);
