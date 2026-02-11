const mongoose = require("mongoose");
const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter the shop name"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      required: [true, "Please enter the contact number"],
      validate: {
        validator: function (v) {
          return /^(\+92|0)?\d{10}$/.test(v);
        },
        message: "Please enter a valid contact number",
      },
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: [true, "Please select the city"],
    },
  },
  { timestamps: true }
);
const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
