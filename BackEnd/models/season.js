const mongoose = require("mongoose");
const seasonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Winter", "Spring", "Summer", "Autumn"],
  },
  dryFruits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Season", seasonSchema);
