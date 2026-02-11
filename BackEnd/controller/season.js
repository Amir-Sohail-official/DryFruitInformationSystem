const catchAsync = require("../util/catch-async");
const seasonService = require("../services/season");

exports.createSeason = catchAsync(async (req, res) => {
  const season = await seasonService.createSeason(req.body);
  res.status(201).json({ status: "success", data: season });
});

exports.getAllSeasons = catchAsync(async (req, res) => {
  const seasons = await seasonService.getAllSeasons();
  res.status(200).json({ status: "success", data: seasons });
});

exports.getSeasonById = catchAsync(async (req, res) => {
  const season = await seasonService.getSeasonById(req.params.id);
  res.status(200).json({ status: "success", data: season });
});

exports.updateSeason = catchAsync(async (req, res) => {
  const season = await seasonService.updateSeason(req.params.id, req.body);
  res.status(200).json({ status: "success", data: season });
});

exports.deleteSeason = catchAsync(async (req, res) => {
  await seasonService.deleteSeason(req.params.id);
  res.status(204).json({ status: "success", data: null });
});

exports.getTodayAlert = catchAsync(async (req, res) => {
  const season = await seasonService.getCurrentSeason();

  res.status(200).json({
    status: "success",
    data: season,
  });
});
