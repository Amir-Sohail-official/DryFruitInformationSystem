const app = require("../app");
const connectDB = require("../confiq/db");

let dbReady = null;
if (!dbReady) {
  dbReady = connectDB();
}

module.exports = async (req, res) => {
  await dbReady;
  return app(req, res);
};

