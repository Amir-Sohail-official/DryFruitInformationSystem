const catchAsync = require("../util/catch-async");
const statsService = require("../services/stats");

exports.getOverviewStats = catchAsync(async (req, res) => {
  const stats = await statsService.getOverviewStats();

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

exports.getPublicStats = catchAsync(async (req, res) => {
  const stats = await statsService.getPublicStats();

  res.status(200).json({
    status: "success",
    data: stats,
  });
});