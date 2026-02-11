const Province = require("../models/province");

exports.create = async (data) => {
  return Province.create(data);
};

exports.insertMany = async (data) => {
  return Province.insertMany(data);
};

exports.findAll = async () => {
  return Province.find();
};

exports.findById = async (id) => {
  return Province.findById(id);
};

exports.updateById = async (id, updateData, options = {}) => {
  return Province.findByIdAndUpdate(id, updateData, options);
};

exports.deleteById = async (id) => {
  return Province.findByIdAndDelete(id);
};
exports.countDocument = async () => {
  return await Province.countDocuments();
};
