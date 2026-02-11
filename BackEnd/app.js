/**
 * Main Express application setup.
 *
 * Features:
 * - Loads environment variables from `config.env`
 * - Parses incoming JSON requests
 * - Logs requests in development mode using Morgan
 * - Provides routes for users and products
 * - Handles undefined routes and global errors
 *
 * Routes:
 *   - /api/v1/products → Product API
 *   - /api/v1/users    → User API
 *
 * Error handling:
 *   - Catches unknown routes and forwards to AppError
 *   - Uses global error middleware for centralized error handling
 */

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRouter = require("./routes/user.routes");
const golobalErrorHandler = require("./middleware/error.middleware");
const productRouter = require("./routes/product.routes");
const AppError = require("./util/app-errors");
const provinceRouter = require("./routes/province");
const cityRouter = require("./routes/city.js");
const shopRouter = require("./routes/shop");
const FeedbackRouter = require("./routes/feed-back.js");
const contactRouter = require("./routes/contact");
const seasonRoutes = require("./routes/season.js");
const healthRouter = require("./routes/health");
const statsRoutes = require("./routes/stats");
const qaRoutes = require("./routes/qaRoutes");
const cors = require("cors");
const path = require("path");

// Load environment variables from file only in non-production (local dev)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "./config.env" });
}

const app = express();

// Middleware: parse JSON bodies
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * Middleware: request logger
 * Enabled only in development mode.
 */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * Routes:
 * Product routes and User routes
 */
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/provinces", provinceRouter);
app.use("/api/v1/cities", cityRouter);
app.use("/api/v1/shops", shopRouter);
app.use("/api/v1/feedbacks", FeedbackRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/seasons", seasonRoutes);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/stats", statsRoutes);
app.use("/api/qa", qaRoutes);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/provinces", provinceRouter);
app.use("/api/cities", cityRouter);
app.use("/api/shops", shopRouter);
app.use("/api/feedbacks", FeedbackRouter);
app.use("/api/contacts", contactRouter);
app.use("/api/seasons", seasonRoutes);
app.use("/api/health", healthRouter);
app.use("/api/stats", statsRoutes);
/**
 * Handle all undefined routes
 * Forwards to the global error handler with a 404 error.
 */
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/**
 * Global error handling middleware
 */
app.use(golobalErrorHandler);

module.exports = app;
