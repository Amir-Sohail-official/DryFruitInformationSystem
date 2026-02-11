const mongoose = require("mongoose");

let cached = global.__mongooseConn;
if (!cached) {
  cached = global.__mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    const uri =
      process.env.MONGODB_URI ||
      process.env.DATABASE_URL ||
      process.env.DATABASE_LOCAL;

    if (!uri) {
      throw new Error(
        "Missing Mongo connection string (MONGODB_URI/DATABASE_URL/DATABASE_LOCAL)"
      );
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
    cached.conn = await cached.promise;

    console.log(`✅ Database connected: ${mongoose.connection.host}`);
    return cached.conn;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    throw err;
  }
};

module.exports = connectDB;
