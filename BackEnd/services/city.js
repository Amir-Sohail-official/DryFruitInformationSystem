const Province = require("../models/province");
const cityRepo = require("../repository/city");
const AppError = require("../util/app-errors");
exports.createCity = async (dataBody) => {
  const { name, province } = dataBody;
  if (!name || !province) {
    throw new AppError("City name and Province ID are required", 400);
  }
  const provincedoc = await Province.findById(province);
  if (!provincedoc) {
    throw new AppError(`Province with ID '${province}' not found`, 404);
  }
  const city = await cityRepo.create({ name, province });
  return city;
};
exports.getAllCities = async () => {
  const cities = await cityRepo.findAll();
  if (!cities.length) throw new AppError("No cities found", 404);
  return cities;
};
exports.getCityById = async (id) => {
  const city = await cityRepo.findById(id);
  if (!city) throw new AppError(`No city found with ID: ${id}`, 404);
  return city;
};
exports.updateCity = async (id, updatesData) => {
  const allowedUpdates = ["name", "province"];
  const updates = { ...(updatesData || {}) };

  // Remove fields that are not allowed
  Object.keys(updates).forEach((key) => {
    if (!allowedUpdates.includes(key)) {
      delete updates[key];
    }
  });

  // If province is being updated, check existence
  if (updates.province) {
    const provinceExists = await Province.findById(updates.province);
    if (!provinceExists) {
      throw new AppError(
        `Province with ID '${updates.province}' not found`,
        404
      );
    }
  }

  // Find city
  const city = await cityRepo.findById(id);
  if (!city) {
    throw new AppError("City not found", 404);
  }

  // Apply updates
  Object.assign(city, updates);
  await city.save();

  return city;
};
exports.deleteCity = async (id) => {
  return await cityRepo.deleteById(id);
};
