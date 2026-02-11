const express = require("express");
const healthController = require("../controller/health");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    healthController.createHealthInfo
  )
  .get(healthController.getAllHealthInfo);

router
  .route("/:id")
  .get(healthController.getHealthInfoById)
  .put(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    healthController.updateHealthInfo
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo("admin"),
    healthController.deleteHealthInfo
  );

module.exports = router;
