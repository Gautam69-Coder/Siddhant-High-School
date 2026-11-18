
const mongoose = require("mongoose");
const { EVENT_CATEGORIES } = require("../constants/enums");

const calendarEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    event_date: {
      type: Date,
      required: [true, "Event date is required"],
      index: true,
    },
    start_time: {
      type: String,
      default: null,
    },
    end_time: {
      type: String,
      default: null,
    },
    venue: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: EVENT_CATEGORIES,
      required: true,
    },
    target_audience: {
      type: String,
      default: null,
    },
    faculty_coordinator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FacultyMember",
      default: null,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
