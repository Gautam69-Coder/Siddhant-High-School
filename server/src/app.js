const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ApiResponse = require("./utils/apiResponse");
const ApiError = require("./utils/apiError");

const app = express();

// Core Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Static File Serving for Uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health Check Endpoint
app.get("/api/v1/health", (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      { status: "OK", timestamp: new Date().toISOString() },
      "Siddhant High School API is running"
    )
  );
});

// Mount API v1 Routes
const rootRouter = require("./routes");
app.use("/api/v1", rootRouter);

// 404 Not Found Handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
