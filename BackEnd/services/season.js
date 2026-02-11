const seasonRepository = require("../repository/season");
const AppError = require("../util/app-errors");
exports.createSeason = async (data) => {
  return await seasonRepository.create(data);
};
exports.getAllSeasons = async () => {
  return await seasonRepository.findAll();
};
exports.getSeasonById = async (id) => {
  const season = await seasonRepository.findById(id);
  if (!season) throw new AppError("Season not found", 404);
  return season;
};
exports.updateSeason = async (id, data) => {
  const season = await seasonRepository.update(id, data);
  if (!season) throw new AppError("Season not found", 404);
  return season;
};
exports.deleteSeason = async (id) => {
  const season = await seasonRepository.delete(id);
  if (!season) throw new AppError("Season not found", 404);
  return season;
};

exports.getCurrentSeason = async () => {
  const season = await seasonRepository.findCurrentSeason();
  return season;
};
