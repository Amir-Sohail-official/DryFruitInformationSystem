const AppError = require("../util/app-errors");
const provinceRepo = require("../repository/province");

exports.createProvince = async (data) => {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new AppError("Province data is required", 400);
    }
    return provinceRepo.insertMany(data);
  }

  if (!data.name) {
    throw new AppError("Province name is required", 400);
  }

  return provinceRepo.create(data);
};

exports.getAllProvinces = async () => {
  const provinces = await provinceRepo.findAll();
  if (!provinces.length) {
    throw new AppError("No provinces found", 404);
  }
  return provinces;
};

exports.getProvinceById = async (id) => {
  const province = await provinceRepo.findById(id);
  if (!province) {
    throw new AppError(`No province found with ID: ${id}`, 404);
  }
  return province;
};

exports.updateProvince = async (id, updatedData) => {
  const province = await provinceRepo.updateById(id, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!province) {
    throw new AppError("Province not found", 404);
  }
  return province;
};

exports.deleteProvince = async (id) => {
  const province = await provinceRepo.deleteById(id);
  if (!province) {
    throw new AppError("Province not found", 404);
  }
  return province;
};
