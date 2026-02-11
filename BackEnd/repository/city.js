const City = require("../models/city");
exports.create = async (data) => {
  return await City.create(data);
};

exports.findAll = async () => {
  return await City.find().populate("province", "name");
};
exports.findById = async (id) => {
  return await City.findById(id).populate("province", "name");
};
exports.updateById = async (id, uptatesData) => {
  return await City.findByIdAndUpdate(id, uptatesData, {
    new: true,
    runValidators: true,
  });
};
exports.deleteById = async (id) => {
  return await City.findByIdAndDelete(id);
};
exports.countDocument = async () => {
  return await City.countDocuments();
};
