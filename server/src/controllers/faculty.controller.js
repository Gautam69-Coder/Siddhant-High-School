const mongoose = require("mongoose");
const FacultyMember = require("../models/facultyMember.model");
const ApiError = require("../utils/apiError");
const { ROLES } = require("../constants/enums");

const isStaffViewer = (user) =>
  Boolean(user && [ROLES.SUPER_ADMIN, ROLES.CMS_EDITOR].includes(user.role));

const sanitizeFacultyForPublic = (member) => {
  const obj = typeof member?.toObject === "function" ? member.toObject() : { ...member };
  delete obj.email;
  return obj;
};

// CREATE faculty member
const createFaculty = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      throw new ApiError(400, "Request body must be a JSON object");
    }
    const faculty = await FacultyMember.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Faculty member created successfully",
      data: faculty,
    });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

// GET all faculty members
const getAllFaculty = async (req, res, next) => {
  try {
    const staffViewer = isStaffViewer(req.user);
    const filter = staffViewer ? {} : { is_active: true };
    const faculty = await FacultyMember.find(filter).sort({
      display_order: 1,
      created_at: -1,
    });

    const data = staffViewer ? faculty : faculty.map(sanitizeFacultyForPublic);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// GET faculty member by ID
const getFacultyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid faculty ID",
      });
    }

    const staffViewer = isStaffViewer(req.user);
    const faculty = await FacultyMember.findById(id);

    if (!faculty || (!staffViewer && faculty.is_active === false)) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: staffViewer ? faculty : sanitizeFacultyForPublic(faculty),
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE faculty member
const updateFaculty = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      throw new ApiError(400, "Request body must be a JSON object");
    }
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid faculty ID",
      });
    }

    const faculty = await FacultyMember.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty member updated successfully",
      data: faculty,
    });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

// DELETE faculty member
const deleteFaculty = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid faculty ID",
      });
    }

    const faculty = await FacultyMember.findByIdAndDelete(id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty member deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};
