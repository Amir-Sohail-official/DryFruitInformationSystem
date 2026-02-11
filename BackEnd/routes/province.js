const express = require("express");
const router = express.Router();
const provinceController = require("../controller/province");
router
  .route("/")
  .post(provinceController.createProvince)
  .get(provinceController.getAllProvinces);
router
  .route("/:id")
  .get(provinceController.getProvince)
  .patch(provinceController.updateProvince)
  .delete(provinceController.deleteProvince);
module.exports = router;
