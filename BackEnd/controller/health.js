const catchAsync = require("../util/catch-async");
const healthService = require("../services/health");

exports.createHealthInfo = catchAsync(async (req, res) => {
  const newHealthInfo = await healthService.createHealthInfo(req.body);
  res.status(201).json({
    status: "success",
    data: { healthInfo: newHealthInfo },
  });
});

exports.getAllHealthInfo = catchAsync(async (req, res) => {
  const healthInfo = await healthService.getAllHealthInfo();
  res.status(200).json({
    status: "success",
    results: healthInfo.length,
    data: { healthInfo },
  });
});

exports.getHealthInfoById = catchAsync(async (req, res) => {
  const healthInfo = await healthService.getHealthInfoById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { healthInfo },
  });
});

exports.updateHealthInfo = catchAsync(async (req, res) => {
  const updatedHealth = await healthService.updateHealthInfo(
    req.params.id,
    req.body
  );
  res.status(200).json({
    status: "success",
    data: { healthInfo: updatedHealth },
  });
});

exports.deleteHealthInfo = catchAsync(async (req, res) => {
  await healthService.deleteHealthInfo(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
