const mongoose = require("mongoose");
const provinceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter the name for the province"],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);
const Province = mongoose.model("Province", provinceSchema);
module.exports = Province;
