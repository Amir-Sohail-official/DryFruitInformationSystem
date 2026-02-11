const cityService = require("../services/city.js");
const catchAsync = require("../util/catch-async");

/**
 * Create a new city
 * @route POST /api/v1/cities
 * @access Public
 */
exports.createCity = catchAsync(async (req, res) => {
  const city = await cityService.createCity(req.body);

  res.status(201).json({
    status: "success",
    data: { city },
  });
});

/**
 * Get all cities
 * @route GET /api/v1/cities
 * @access Public
 */
exports.getAllCities = catchAsync(async (req, res) => {
  const cities = await cityService.getAllCities();

  res.status(200).json({
    status: "success",
    count: cities.length,
    data: { cities: cities },
  });
});

/**
 * Get a single city by ID
 * @route GET /api/v1/cities/:id
 * @access Public
 */
exports.getCity = catchAsync(async (req, res) => {
  const city = await cityService.getCityById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { city },
  });
});

/**
 * Update a city by ID
 * @route PATCH /api/v1/cities/:id
 * @access Public
 */
exports.updateCity = catchAsync(async (req, res) => {
  const city = await cityService.updateCity(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    data: { city },
  });
});

/**
 * Delete a city by ID
 * @route DELETE /api/v1/cities/:id
 * @access Public
 */
exports.deleteCity = catchAsync(async (req, res) => {
  await cityService.deleteCity(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
