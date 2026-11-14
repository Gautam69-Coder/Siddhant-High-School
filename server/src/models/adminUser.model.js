const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ROLES } = require("../constants/enums");

const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password_hash: {
      type: String,
      required: [true, "Password is required"],
    },
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.SUPER_ADMIN,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    last_login_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

adminUserSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 10);
  next();
});

adminUserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

adminUserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

module.exports = mongoose.model("AdminUser", adminUserSchema);
