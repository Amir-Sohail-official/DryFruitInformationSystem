/**
 * Script to import or delete product data in the MongoDB database.
 *
 * Usage:
 *   node dev-data/data/import-dev-data.js --import   # Import sample data into DB
 *   node dev-data/data/import-dev-data.js --delete   # Delete all data from DB
 *
 * This script reads product data from `product.json` and either:
 *   - Inserts it into the database, or
 *   - Deletes all product data from the database,
 * based on the command-line argument provided.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Product = require("../../models/product.model");

// Load environment variables from config file
dotenv.config({ path: "./config.env" });

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI ||
      process.env.DATABASE_URL ||
      process.env.DATABASE_LOCAL
  )
  .then(() => console.log("Database connected successfully"));

// Read product data from JSON file
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/product.json`, "utf-8")
);

/**
 * Import product data into the database.
 * Reads product data from JSON file and inserts it into the `Product` collection.
 */
const importData = async () => {
  try {
    await Product.create(products);
    console.log("Data successfully inserted!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

/**
 * Delete all product data from the database.
 * Removes every document from the `Product` collection.
 */
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data successfully deleted!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Run function based on command-line argument
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
