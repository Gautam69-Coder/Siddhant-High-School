require("dotenv").config();
require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
const app = require("./app");
const connectDB = require("./config/db");
const { AdminUser } = require("./models");
const { ROLES } = require("./constants/enums");

const PORT = process.env.PORT || 5000;

const ensureSuperAdmin = async () => {
  try {
    const existing = await AdminUser.findOne({ email: "admin@siddhanthighschool.edu" });
    if (!existing) {
      await AdminUser.create({
        email: "admin@siddhanthighschool.edu",
        password_hash: "admin123",
        full_name: "Dr. Katherine Price",
        role: ROLES.SUPER_ADMIN,
        is_active: true,
      });
      console.log("✅ Seeded default Super Admin: admin@siddhanthighschool.edu / admin123");
    }
  } catch (err) {
    console.warn("Notice: could not auto-check admin seed:", err.message);
  }
};

connectDB()
  .then(async () => {
    await ensureSuperAdmin();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
