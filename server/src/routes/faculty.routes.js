const { Router } = require("express");

const {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/faculty.controller");

const router = Router();

// Create faculty
router.post("/", createFaculty);

// Get all faculty
router.get("/", getAllFaculty);

// Get faculty by ID
router.get("/:id", getFacultyById);

// Update faculty
router.put("/:id", updateFaculty);

// Delete faculty
router.delete("/:id", deleteFaculty);

module.exports = router;