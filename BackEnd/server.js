const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
const envPath = path.join(__dirname, "config.env");
dotenv.config({ path: envPath });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("🔥 Uncaught Exception! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");
const connectDB = require("./confiq/db");

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("🔥 Unhandled Rejection! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
