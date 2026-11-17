const mongoose = require("mongoose");
const crypto = require("crypto");
const AdmissionApplication = require("../models/admissionApplication.model");
const cloudinary = require("../config/cloudinary");

// Generate application number
const generateApplicationNumber = () => {
  const year = new Date().getFullYear();
  const randomCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `SHS-${year}-${randomCode}`;
};

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "siddhant-high-school/admissions",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
};

// POST: Create admission application
const createAdmission = async (req, res, next) => {
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
    
    const files = req.files || {};

    const studentPhoto = files.student_photo?.[0]
      ? await uploadToCloudinary(files.student_photo[0])
      : null;

    const birthCertificate = files.birth_certificate?.[0]
      ? await uploadToCloudinary(files.birth_certificate[0])
      : null;

    const previousSchoolReport = files.previous_school_report?.[0]
      ? await uploadToCloudinary(files.previous_school_report[0])
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
