const express = require("express");
const contactController = require("../controller/contact");
const authMiddlware = require("../middleware/auth");
const opitionalAuth = require("../middleware/optionalAuth");

const router = express.Router();

// Anyone can create a contact query
router.post("/", opitionalAuth.optionalAuth, contactController.createContact);

// Admin only routes
router.get(
  "/",
  authMiddlware.protect,
  authMiddlware.restrictTo("admin"),
  contactController.getAllContacts
);
router.delete(
  "/:id",
  authMiddlware.protect,
  authMiddlware.restrictTo("admin"),
  contactController.deleteContact
);

module.exports = router;
