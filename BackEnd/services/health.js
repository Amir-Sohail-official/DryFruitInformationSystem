const healthRepo = require("../repository/health");
const AppError = require("../util/app-errors");

exports.createHealthInfo = async (data) => {
  return await healthRepo.create(data);
};

exports.getAllHealthInfo = async () => {
  return await healthRepo.getAll();
};

exports.getHealthInfoById = async (id) => {
  const health = await healthRepo.getById(id);
  if (!health) throw new AppError("No health info found with this ID", 404);

  health.avoidDryFruits = health.avoidDryFruits.filter(
    (item) => item.product !== null
  );
  health.recommendedDryFruits = health.recommendedDryFruits.filter(
    (item) => item.product !== null
  );

  return health;
};

exports.updateHealthInfo = async (id, data) => {
  const updated = await healthRepo.update(id, data);
  if (!updated) throw new AppError("No health info found with this ID", 404);
  return updated;
};

exports.deleteHealthInfo = async (id) => {
  const deleted = await healthRepo.delete(id);
  if (!deleted) throw new AppError("No health info found with this ID", 404);
  return deleted;
};
