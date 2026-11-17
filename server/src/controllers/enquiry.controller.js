
const { GeneralEnquiry } = require("../models");
const ApiResponse = require("../utils/apiResponse");
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

module.exports = { createEnquiry };