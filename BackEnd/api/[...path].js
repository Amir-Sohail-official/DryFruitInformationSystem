const app = require("../app");
const connectDB = require("../confiq/db");

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    return app(req, res);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err?.message || "Server error",
    });
  }
};
