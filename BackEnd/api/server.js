const app = require("../app");
const connectDB = require("../config/db");

// Connect DB once
let dbReady = null;
if (!dbReady) dbReady = connectDB();

module.exports = async (req, res) => {
  try {
    await dbReady;

    // Root path
    if (req.url === "/" && req.method === "GET") {
      return res.status(200).send("Hello World");
    }

    // Let Express handle all other routes
    return app(req, res);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
