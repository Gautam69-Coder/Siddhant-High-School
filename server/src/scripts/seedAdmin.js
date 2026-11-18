require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { AdminUser } = require("../models");
const { ROLES } = require("../constants/enums");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await AdminUser.findOne({
      email: "admin@siddhanthighschool.edu",
    });

    if (existingAdmin) {
      console.log("ℹ️  Default Super Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const admin = await AdminUser.create({
      email: "admin@siddhanthighschool.edu",
      password_hash: "admin123", // Pre-save hook will hash this password
      full_name: "Dr. Katherine Price",
      role: ROLES.SUPER_ADMIN,
      is_active: true,
    });

    console.log("✅ Super Admin created successfully:");
    console.log(`   Email: ${admin.email}`);
    console.log("   Password: admin123");
    console.log(`   Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding Super Admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
