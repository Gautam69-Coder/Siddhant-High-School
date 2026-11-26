require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { AdminUser } = require("../models");
const { ROLES } = require("../constants/enums");
const {
  MAX_BCRYPT_PASSWORD_BYTES,
  MIN_PASSWORD_CHARACTERS,
  getPasswordByteCount,
  getPasswordCharacterCount,
} = require("../utils/adminPasswordPolicy");

// A fixed document ID makes concurrent first-admin setup attempts mutually exclusive.
const INITIAL_SUPER_ADMIN_ID = new mongoose.Types.ObjectId(
  "000000000000000000000001"
);

const getInitialAdminDetails = () => {
  const email = process.env.INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  const full_name = process.env.INITIAL_ADMIN_FULL_NAME?.trim();

  if (!email || !password || !full_name) {
    throw new Error(
      "Set INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PASSWORD and INITIAL_ADMIN_FULL_NAME before running the seed command."
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("INITIAL_ADMIN_EMAIL must be a valid email address.");
  }

  if (getPasswordCharacterCount(password) < MIN_PASSWORD_CHARACTERS) {
    throw new Error("INITIAL_ADMIN_PASSWORD must be at least 12 characters long.");
  }
  if (getPasswordByteCount(password) > MAX_BCRYPT_PASSWORD_BYTES) {
    throw new Error("INITIAL_ADMIN_PASSWORD cannot exceed 72 UTF-8 bytes.");
  }

  return { email, password, full_name };
};

const seedAdmin = async () => {
  try {
    const initialAdmin = getInitialAdminDetails();
    await connectDB();

    if (await AdminUser.countDocuments()) {
      throw new Error("Administrator setup has already been completed.");
    }

    await AdminUser.create({
      _id: INITIAL_SUPER_ADMIN_ID,
      email: initialAdmin.email,
      password_hash: initialAdmin.password,
      full_name: initialAdmin.full_name,
      role: ROLES.SUPER_ADMIN,
      is_active: true,
    });

    console.log("Initial Super Admin account created successfully.");
    console.log("Remove the initial-admin environment values from the runtime after setup.");
  } catch (error) {
    console.error(
      "Initial Super Admin setup failed. Check the setup environment values and whether an administrator already exists."
    );
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch {
      // Do not log connection details or setup values.
    }
  }
};

seedAdmin();
