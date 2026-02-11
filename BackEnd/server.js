const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./confiq/db");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "config.env") });

// Connect to MongoDB only once
let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    try {
      await connectDB();
      console.log("✅ MongoDB connected!");
      isConnected = true;
    } catch (err) {
      console.error("❌ MongoDB connection failed:", err);
      throw err;
    }
  }
}

// Import Express app
const app = require("./app");

// Wrap app with database connection for Vercel serverless
module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    app(req, res);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
