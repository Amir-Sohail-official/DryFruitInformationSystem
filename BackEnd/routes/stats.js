const express = require("express");
const statsController = require("../controller/stats");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Public stats endpoint (no authentication required)
router.get("/public", statsController.getPublicStats);

// Admin-only overview stats
router.get(
  "/overview",
  authMiddleware.protect,
  authMiddleware.restrictTo("admin"),
  statsController.getOverviewStats
);

module.exports = router;
