const Shop = require("../models/shop");
exports.create = async (data) => {
  return await Shop.create(data);
};
exports.findAll = async () => {
  return await Shop.find().populate({
    path: "city",
    select: "name",
    populate: { path: "province", select: "name" },
  });
};
exports.findById = async (id) => {
  return await Shop.findById(id).populate({
    path: "city",
    select: "name",
    populate: { path: "province", select: "name" },
  });
};
exports.findByIdRaw = async (id) => {
  // raw find without populate (for updates)
  return await Shop.findById(id);
};
exports.deleteById = async (id) => {
  return await Shop.findByIdAndDelete(id);
};
exports.countDocument = async () => {
  return await Shop.countDocuments();
};
