const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: [true, "Please add the product name"],
      trim: true,
    },
    description: { type: String, required: true },
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0 },
    carbs: { type: Number, required: true, min: 0 },
    fats: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },

    // ✅ Diet information
    dietInfo: {
      type: String,
      default: "A nutritious food, suitable for most diets.",
    },
    vitamins: {
      vitaminE: { type: Number, default: 0 },
      vitaminB6: { type: Number, default: 0 },
      vitaminK: { type: Number, default: 0 },
    },

    minerals: {
      magnesium: { type: Number, default: 0 },
      potassium: { type: Number, default: 0 },
      iron: { type: Number, default: 0 },
      calcium: { type: Number, default: 0 },
    },

    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },

    province: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Province",
    },

    trending: { type: Boolean, default: false },
    benefits: {
      type: String,
    },
    unbenefits: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
