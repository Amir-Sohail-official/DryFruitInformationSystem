const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

// Routers
const userRouter = require("./routes/user.routes");
const productRouter = require("./routes/product.routes");
const provinceRouter = require("./routes/province");
const cityRouter = require("./routes/city.js");
const shopRouter = require("./routes/shop");
const feedbackRouter = require("./routes/feed-back.js");
const contactRouter = require("./routes/contact");
const seasonRouter = require("./routes/season.js");
const healthRouter = require("./routes/health");
const statsRouter = require("./routes/stats");
const qaRouter = require("./routes/qaRoutes");

// Utilities
const AppError = require("./util/app-errors");
const globalErrorHandler = require("./middleware/error.middleware");

const app = express();

// ------------------- MIDDLEWARE -------------------
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ------------------- ROUTES -------------------
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Backend is running!" });
});

app.get("/api/v1/healthz", (req, res) => {
  const hasMongo =
    !!process.env.MONGODB_URI ||
    !!process.env.DATABASE_URL ||
    !!process.env.DATABASE_LOCAL;
  const hasJwt = !!process.env.JWT_SECRET_KEY;
  const hasEmail =
    !!process.env.EMAIL_USERNAME && !!process.env.EMAIL_PASSWORD;
  const hasCloudinary =
    !!process.env.CLOUDINARY_URL ||
    (!!process.env.CLOUDINARY_CLOUD_NAME &&
      !!process.env.CLOUDINARY_API_KEY &&
      !!process.env.CLOUDINARY_API_SECRET);

  res.status(200).json({
    status: "ok",
    node: process.version,
    env: process.env.NODE_ENV || "undefined",
    checks: {
      mongoConfigured: hasMongo,
      jwtConfigured: hasJwt,
      emailConfigured: hasEmail,
      cloudinaryConfigured: hasCloudinary,
    },
  });
});

// API routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/provinces", provinceRouter);
app.use("/api/v1/cities", cityRouter);
app.use("/api/v1/shops", shopRouter);
app.use("/api/v1/feedbacks", feedbackRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/seasons", seasonRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/stats", statsRouter);
app.use("/api/v1/qa", qaRouter);

// ------------------- ERROR HANDLING -------------------
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
