const express = require("express");
const router = express.Router();
const cityController = require("../controller/city");
router
  .route("/")
  .post(cityController.createCity)
  .get(cityController.getAllCities);
router
  .route("/:id")
  .get(cityController.getCity)
  .patch(cityController.updateCity)
  .delete(cityController.deleteCity);
module.exports = router;
