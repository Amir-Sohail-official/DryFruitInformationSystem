const catchAsync = require("../util/catch-async");
const provinceService = require("../services/province");

/**
 * @desc    Create a new province
 * @route   POST /api/v1/provinces
 */
exports.createProvince = catchAsync(async (req, res) => {
  const result = await provinceService.createProvince(req.body);

  res.status(201).json({
    status: "success",
    data: { province: result },
  });
});

/**
 * @desc    Get all provinces
 * @route   GET /api/v1/provinces
 */
exports.getAllProvinces = catchAsync(async (req, res) => {
  const provinces = await provinceService.getAllProvinces();

  res.status(200).json({
    status: "success",
    count: provinces.length,
    data: { provinces },
  });
});

/**
 * @desc    Get single province by ID
 * @route   GET /api/v1/provinces/:id
 */
exports.getProvince = catchAsync(async (req, res) => {
  const province = await provinceService.getProvinceById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { province },
  });
});

/**
 * @desc    Update province by ID
 * @route   PATCH /api/v1/provinces/:id
 */
exports.updateProvince = catchAsync(async (req, res) => {
  const province = await provinceService.updateProvince(
    req.params.id,
    req.body
  );
  res.status(200).json({
    status: "success",
    data: { province },
  });
});

/**
 * @desc    Delete province by ID
 * @route   DELETE /api/v1/provinces/:id
 */
exports.deleteProvince = catchAsync(async (req, res) => {
  await provinceService.deleteProvince(req.params.id);
  res.status(204).send();
});
