import connectToDB from "../confiq/db.js";
import app from "../app.js";

let dbReady = null;

// Connect to DB only once
if (!dbReady) {
  dbReady = connectToDB();
}

export default async function handler(req, res) {
  await dbReady; // ensure MongoDB connection

  // Express app expects `req` and `res` to be Node http objects
  // Use this trick to let Express handle the serverless request
  return new Promise((resolve) => {
    app(req, res, () => resolve());
  });
}
