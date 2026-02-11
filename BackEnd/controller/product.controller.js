const productService = require("../services/product");
const catchAsync = require("../util/catch-async");
const AppError = require("../util/app-errors");
const cloudinary = require("../util/cloudinary");

exports.searchProducts = catchAsync(async (req, res) => {
  const filters = {
    province: req.query.province,
    price: req.query.price,
    trending: req.query.trending,
  };

  const products = await productService.searchProducts(filters);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: { products },
  });
});

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Public
 */

exports.createProduct = catchAsync(async (req, res, next) => {
  const productData = req.body;
  
  if (req.file) {
    const uploadsConfigured =
      process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET);
    if (!uploadsConfigured) {
      return next(
        new AppError("Image upload is not configured on the server", 503)
      );
    }
    const buffer = req.file.buffer;
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "dryfruit/products", resource_type: "image" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(buffer);
      });
    const result = await streamUpload();
    productData.image = result.secure_url;
  } else if (!productData.image) {
    return next(new AppError("Product image is required", 400));
  }
  
  const product = await productService.createProduct(productData);

  res.status(201).json({
    status: "success",
    data: { product },
  });
});

/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getAllProducts = catchAsync(async (req, res) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 11;

    const result = await productService.getAllProducts(isAdmin, page, limit);

    // ✅ If admin → show pagination details
    if (isAdmin) {
      return res.status(200).json({
        status: "success",
        totalProducts: result.totalProducts,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        results: result.products.length,
        data: { products: result.products },
      });
    }

    // ✅ For normal/guest user → show all products
    res.status(200).json({
      status: "success",
      results: result.products.length,
      data: { products: result.products },
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    throw error;
  }
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

/**
 * @desc    Update a product
 * @route   PATCH /api/v1/products/:id
 * @access  Public
 */
exports.updateProduct = catchAsync(async (req, res) => {
  if (req.file) {
    const uploadsConfigured =
      process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET);
    if (!uploadsConfigured) {
      return next(
        new AppError("Image upload is not configured on the server", 503)
      );
    }
    const buffer = req.file.buffer;
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "dryfruit/products", resource_type: "image" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(buffer);
      });
    const result = await streamUpload();
    req.body.image = result.secure_url;
  }
  
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    data: { product },
  });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/products/:id
 * @access  Public
 */
exports.deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.getProductByName = catchAsync(async (req, res) => {
  const name = req.params.name;
  const product = await productService.getProductByName(name);

  res.status(200).json({
    status: "success",
    data: { product },
  });
});
