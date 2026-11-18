
const mongoose = require("mongoose");
const { GeneralEnquiry } = require("../models");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

// Submit General Enquiry
const createEnquiry = asyncHandler(async (req, res) => {
  const {
    parent_name,
    email,
    phone,
    grade_interested,
    category,
    message,
  } = req.body;

  const enquiry = await GeneralEnquiry.create({
    parent_name,
    email,
    phone,
    grade_interested,
    category,
    message,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      enquiry,
      "General enquiry submitted successfully"
    )
  );
});

// Get all enquiries
const getAllEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await GeneralEnquiry.find().sort({ created_at: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      enquiries,
      "Enquiries retrieved successfully"
    )
  );
});

// Update enquiry status
const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, response_notes } = req.body;

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  let enquiry;
  if (mongoose.isValidObjectId(id)) {
    enquiry = await GeneralEnquiry.findById(id);
  }

  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }

  enquiry.status = status;
  if (response_notes !== undefined) {
    enquiry.response_notes = response_notes;
  }
  await enquiry.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      enquiry,
      "Enquiry status updated successfully"
    )
  );
});

// Delete enquiry
const deleteEnquiry = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let enquiry;
  if (mongoose.isValidObjectId(id)) {
    enquiry = await GeneralEnquiry.findByIdAndDelete(id);
  }

  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Enquiry deleted successfully"
    )
  );
});

module.exports = {
  createEnquiry,
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};