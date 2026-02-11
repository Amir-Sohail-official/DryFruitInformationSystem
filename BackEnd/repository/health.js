const HealthInfo = require("../models/health");

exports.create = async (data) => {
  return await HealthInfo.create(data);
};

exports.getAll = async () => {
  return await HealthInfo.find()
    .populate([
      { path: "avoidDryFruits.product", select: "product image -_id" },
      { path: "recommendedDryFruits.product", select: "product image -_id" },
    ])
    .select("diseaseName description avoidDryFruits recommendedDryFruits");
};

exports.getById = async (id) => {
  return await HealthInfo.findById(id)
    .populate([
      { path: "avoidDryFruits.product", select: "product image -_id" },
      { path: "recommendedDryFruits.product", select: "product image -_id" },
    ])
    .select("-_id -__v -createdAt -updatedAt");
};

exports.update = async (id, data) => {
  return await HealthInfo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.delete = async (id) => {
  return await HealthInfo.findByIdAndDelete(id);
};
