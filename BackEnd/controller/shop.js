const shopService = require("../services/shop");
const catchAsync = require("../util/catch-async");

/**
 * @desc    Create a new shop
 * @route   POST /api/v1/shops
 * @access  Private (Admin)
 */
exports.createShop = catchAsync(async (req, res) => {
  const shop = await shopService.createShop(req.body);

  res.status(201).json({
    status: "success",
    data: { shop },
  });
});

/**
 * @desc    Get all shops (with city & province details)
 * @route   GET /api/v1/shops
 * @access  Public
 */
exports.getAllShops = catchAsync(async (req, res) => {
  const shops = await shopService.getAllShops(); // ✅ fixed (added await)

  res.status(200).json({
    status: "success",
    count: shops.length,
    data: { shops },
  });
});

/**
 * @desc    Get single shop by ID
 * @route   GET /api/v1/shops/:id
 * @access  Public
 */
exports.getShop = catchAsync(async (req, res) => {
  const shop = await shopService.getShopById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { shop },
  });
});

/**
 * @desc    Update a shop
 * @route   PATCH /api/v1/shops/:id
 * @access  Private (Admin)
 */
exports.updateShop = catchAsync(async (req, res) => {
  const shop = await shopService.updateShop(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    message: "Shop updated successfully",
    data: { shop },
  });
});

/**
 * @desc    Delete a shop
 * @route   DELETE /api/v1/shops/:id
 * @access  Private (Admin)
 */
exports.deleteShop = catchAsync(async (req, res) => {
  await shopService.deleteShop(req.params.id);
  res.status(204).send();
});
