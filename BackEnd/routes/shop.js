const express = require("express");
const router = express.Router();
const shopController = require("../controller/shop");
router
  .route("/")
  .post(shopController.createShop)
  .get(shopController.getAllShops);
router
  .route("/:id")
  .get(shopController.getShop)
  .patch(shopController.updateShop)
  .delete(shopController.deleteShop);
module.exports = router;
