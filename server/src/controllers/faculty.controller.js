const mongoose = require("mongoose");
const FacultyMember = require("../models/facultyMember.model");

// CREATE faculty member
const createFaculty = async (req, res, next) => {
  try {
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
    const faculty = await FacultyMember.find().sort({
      display_order: 1,
      created_at: -1,
    });

    return res.status(200).json({
      success: true,
      data: faculty,
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

    const faculty = await FacultyMember.findById(id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faculty,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE faculty member
const updateFaculty = async (req, res, next) => {
  try {
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