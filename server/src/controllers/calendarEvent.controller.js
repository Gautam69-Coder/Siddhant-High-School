//

const mongoose = require("mongoose");
const { CalendarEvent } = require("../models");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { EVENT_CATEGORIES } = require("../constants/enums");

// Create a new event
const createCalendarEvent = asyncHandler(async (req, res) => {
  const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
  const { title, event_date, category } = body;

  if (typeof title !== "string" || !title.trim() || typeof event_date !== "string" || !event_date || typeof category !== "string" || !category) {
    throw new ApiError(400, "Title, event date and category are required");
  }

  if (!EVENT_CATEGORIES.includes(category)) {
    throw new ApiError(400, "Invalid event category");
  }

  const parsedDate = new Date(`${event_date}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== event_date) {
    throw new ApiError(400, "Invalid event date");
  }

  const event = await CalendarEvent.create({
    title: title.trim(),
    event_date: parsedDate,
    category,
    created_by: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(201, event, "Event created successfully")
  );
});

// Get all events (public website and admin panel)
const getAllCalendarEvents = asyncHandler(async (req, res) => {
  const events = await CalendarEvent.find()
    .sort({ event_date: 1, created_at: -1 });

  return res.status(200).json(
    new ApiResponse(200, events, "Events retrieved successfully")
  );
});

// Update an event
const updateCalendarEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid event ID");
  }

  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw new ApiError(400, "Request body must be a JSON object");
  }
  const { title, event_date, category } = req.body;
  const updates = {};

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) throw new ApiError(400, "Title cannot be empty");
    updates.title = title.trim();
  }

  if (event_date !== undefined) {
    if (typeof event_date !== "string") throw new ApiError(400, "Invalid event date");
    const parsedDate = new Date(`${event_date}T00:00:00.000Z`);
    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== event_date
    ) {
      throw new ApiError(400, "Invalid event date");
    }
    updates.event_date = parsedDate;
  }

  if (category !== undefined) {
    if (typeof category !== "string" || !EVENT_CATEGORIES.includes(category)) {
      throw new ApiError(400, "Invalid event category");
    }
    updates.category = category;
  }

  const event = await CalendarEvent.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!event) throw new ApiError(404, "Event not found");

  return res.status(200).json(
    new ApiResponse(200, event, "Event updated successfully")
  );
});

// Delete an event
const deleteCalendarEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid event ID");
  }

  const event = await CalendarEvent.findByIdAndDelete(id);

  if (!event) throw new ApiError(404, "Event not found");

  return res.status(200).json(
    new ApiResponse(200, null, "Event deleted successfully")
  );
});

module.exports = {
  createCalendarEvent,
  getAllCalendarEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
};
