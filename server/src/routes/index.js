const { Router } = require("express");
const authRoutes = require("./auth.routes");

const router = Router();

// Mount Auth routes under /api/v1/auth
router.use("/auth", authRoutes);

module.exports = router;
