
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ApiResponse = require("./utils/apiResponse");
const ApiError = require("./utils/apiError");

const app = express();

// Do not derive client addresses from untrusted forwarded headers.
app.set("trust proxy", false);

// Core Middlewares
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://siddhant-high-school.pages.dev",
  "https://admin-shs.pages.dev",
];

const envOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN
      .split(",")
      .map((o) => o.trim().replace(/\/+$/, ""))
  : [];

// Use Set so that allowedOrigins.has(origin) works correctly.
const allowedOrigins = new Set([
  ...defaultAllowedOrigins,
  ...envOrigins,
]);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new ApiError(403, "Origin is not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Only public gallery media is served statically.
// Admission documents are private.
app.use(
  "/uploads/gallery",
  express.static(path.join(__dirname, "../uploads/gallery"), {
    dotfiles: "deny",
    index: false,
  })
);

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
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

module.exports = app;
