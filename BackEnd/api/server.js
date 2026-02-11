const app = require("../app");
const connectDB = require("../config/db");

// Ensure DB connects only once for serverless
let dbReady = null;
if (!dbReady) {
  dbReady = connectDB();
}

module.exports = async (req, res) => {
  try {
    await dbReady; // wait for DB connection

    // If root path '/', print Hello World
    if (req.url === "/" && req.method === "GET") {
      return res.status(200).send("Hello World");
    }

    // Otherwise, pass request to Express app
    return app(req, res);
  } catch (err) {
    console.error("❌ Server error:", err.message);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
