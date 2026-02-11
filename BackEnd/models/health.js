const mongoose = require("mongoose");

const healthInfoSchema = new mongoose.Schema(
  {
    diseaseName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    avoidDryFruits: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          _id: false,
        },
        reason: {
          type: String,
          trim: true,
        },
      },
    ],

    recommendedDryFruits: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          _id: false,
        },
        quantity: {
          type: String,
          trim: true,
        },
        reason: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("HealthInfo", healthInfoSchema);
