const app = require("../BackEnd/app");
const connectDB = require("../BackEnd/confiq/db");

let dbReady = null;
if (!dbReady) {
  dbReady = connectDB();
}

module.exports = async (req, res) => {
  await dbReady;
  return app(req, res);
};
