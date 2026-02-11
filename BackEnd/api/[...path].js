const app = require("../app");
const connectDB = require("../confiq/db");

let dbReady;

module.exports = async (req, res) => {
  try {
    const originalUrl = req.url || "/";
    if (!originalUrl.startsWith("/api")) {
      req.url = `/api${originalUrl}`;
    }

    // Validate required env for DB
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.DATABASE_URL ||
      process.env.DATABASE_LOCAL;

    if (!mongoUri) {
      return res.status(500).json({
        status: "error",
        message:
          "Missing MongoDB connection string. Set MONGODB_URI (or DATABASE_URL/DATABASE_LOCAL) in Vercel Project Settings.",
      });
    }

    if (!dbReady) {
      dbReady = connectDB();
    }

    await dbReady;

    return app(req, res);
  } catch (err) {
    console.error("Serverless Error:", err);

    return res.status(500).json({
      status: "error",
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err?.message || "Server error",
    });
  }
};
