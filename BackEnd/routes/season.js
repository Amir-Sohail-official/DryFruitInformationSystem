const express = require("express");
const router = express.Router();
const seasonController = require("../controller/season");
router.post("/", seasonController.createSeason);
router.get("/", seasonController.getAllSeasons);
router.get("/:id", seasonController.getSeasonById);
router.patch("/:id", seasonController.updateSeason);
router.delete("/:id", seasonController.deleteSeason);

router.get("/alert/today", seasonController.getTodayAlert);

module.exports = router;
