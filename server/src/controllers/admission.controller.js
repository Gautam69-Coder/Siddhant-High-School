const mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const AdmissionApplication = require("../models/admissionApplication.model");
const { CLASS_AGE_CRITERIA } = require("../constants/enums");

// Generate application number
const generateApplicationNumber = () => {
  const year = new Date().getFullYear();
  const randomCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `SHS-${year}-${randomCode}`;
};

// Helper: Safely delete a local file stored under /uploads
const deleteLocalFile = async (relativeFilePath) => {
  if (!relativeFilePath || typeof relativeFilePath !== "string") return;
  try {
    const normalized = relativeFilePath.startsWith("/")
      ? relativeFilePath.slice(1)
      : relativeFilePath;
    const fullPath = path.join(__dirname, "../../", normalized);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (err) {
    console.error(`Failed to delete local file ${relativeFilePath}:`, err.message);
  }
};

// POST: Create admission application
const createAdmission = async (req, res, next) => {
  const files = req.files || {};
  try {
    const {
      student_name,
      dob,
      gender,
      grade_applying,
      previous_school,
      parent_name,
      parent_email,
      parent_phone,
      address,
      city,
      pincode,
    } = req.body;

    if (!dob) {
      const err = new Error("Date of birth is required.");
      err.statusCode = 400;
      throw err;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    if (isNaN(birthDate.getTime())) {
      const err = new Error("Invalid date of birth provided.");
      err.statusCode = 400;
      throw err;
    }

    if (birthDate > today) {
      const err = new Error("Date of birth cannot be in the future.");
      err.statusCode = 400;
      throw err;
    }

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    if (calculatedAge < 3) {
      const err = new Error("Student must be at least 3 years old for admission.");
      err.statusCode = 400;
      throw err;
    }

    if (calculatedAge > 18) {
      const err = new Error("Student must be 18 years or younger for school admission.");
      err.statusCode = 400;
      throw err;
    }

    if (grade_applying && CLASS_AGE_CRITERIA[grade_applying]) {
      const criteria = CLASS_AGE_CRITERIA[grade_applying];
      if (calculatedAge < criteria.minAge) {
        const err = new Error(
          `Student must be at least ${criteria.minAge} years old for ${grade_applying} (current age: ${calculatedAge} years).`
        );
        err.statusCode = 400;
        throw err;
      }
      if (calculatedAge > criteria.maxAge) {
        const err = new Error(
          `Student exceeds maximum age of ${criteria.maxAge} years for ${grade_applying} (current age: ${calculatedAge} years).`
        );
        err.statusCode = 400;
        throw err;
      }
    }

    const studentPhoto = files.student_photo?.[0]
      ? `/uploads/admissions/${files.student_photo[0].filename}`
      : null;

    const birthCertificate = files.birth_certificate?.[0]
      ? `/uploads/admissions/${files.birth_certificate[0].filename}`
      : null;

    const previousSchoolReport = files.previous_school_report?.[0]
      ? `/uploads/admissions/${files.previous_school_report[0].filename}`
      : null;

    const application = await AdmissionApplication.create({
      application_number: generateApplicationNumber(),
      student_name,
      dob,
      gender,
      grade_applying,
      previous_school,
      parent_name,
      parent_email,
      parent_phone,
      address,
      city,
      pincode,
      documents: {
        student_photo: studentPhoto,
        birth_certificate: birthCertificate,
        previous_school_report: previousSchoolReport,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Admission application submitted successfully",
      data: application,
    });
  } catch (error) {
    // Clean up newly written files on disk if database insertion fails
    if (files.student_photo?.[0]) {
      await deleteLocalFile(`/uploads/admissions/${files.student_photo[0].filename}`);
    }
    if (files.birth_certificate?.[0]) {
      await deleteLocalFile(`/uploads/admissions/${files.birth_certificate[0].filename}`);
    }
    if (files.previous_school_report?.[0]) {
      await deleteLocalFile(`/uploads/admissions/${files.previous_school_report[0].filename}`);
    }

    if (error.code === 11000) {
      error.statusCode = 409;
      error.message = "Duplicate application number. Please try again.";
    } else {
      error.statusCode = error.statusCode || 400;
    }
    next(error);
  }
};

// GET: Retrieve all admission applications
const getAllAdmissions = async (req, res, next) => {
  try {
    const applications = await AdmissionApplication.find()
      .sort({ submitted_at: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// GET: Retrieve one application by ID or application number
const getAdmissionById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let application = await AdmissionApplication.findOne({
      application_number: id,
    });

    if (!application && mongoose.isValidObjectId(id)) {
      application = await AdmissionApplication.findById(id);
    }

    if (!application) {
      const error = new Error("Admission application not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH: Update application status
const updateAdmissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      const error = new Error("Status is required");
      error.statusCode = 400;
      throw error;
    }

    let application = await AdmissionApplication.findOne({
      application_number: id,
    });

    if (!application && mongoose.isValidObjectId(id)) {
      application = await AdmissionApplication.findById(id);
    }

    if (!application) {
      const error = new Error("Admission application not found");
      error.statusCode = 404;
      throw error;
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 400;
    next(error);
  }
};

// DELETE: Delete an application
const deleteAdmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    let application;

    if (mongoose.isValidObjectId(id)) {
      application = await AdmissionApplication.findByIdAndDelete(id);
    }

    if (!application) {
      application = await AdmissionApplication.findOneAndDelete({
        application_number: id,
      });
    }

    if (!application) {
      const error = new Error("Admission application not found");
      error.statusCode = 404;
      throw error;
    }

    // Clean up associated uploaded files from disk
    if (application.documents) {
      await Promise.all([
        deleteLocalFile(application.documents.student_photo),
        deleteLocalFile(application.documents.birth_certificate),
        deleteLocalFile(application.documents.previous_school_report),
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "Admission application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateAdmissionStatus,
  deleteAdmission,
};
