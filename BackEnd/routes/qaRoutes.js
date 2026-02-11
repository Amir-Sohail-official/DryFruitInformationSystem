const express = require("express");
const qaController = require("../controller/qa");

const router = express.Router();

router.post("/ask", qaController.askQuestion);

module.exports = router;
