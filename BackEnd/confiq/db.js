const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Make sure the environment variable exists
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is required in your .env file");
    }

    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ Database connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;
