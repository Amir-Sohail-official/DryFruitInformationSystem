const Product = require("../models/product.model");

exports.aggregateProducts = async (pipeline) => {
  return await Product.aggregate(pipeline);
};

exports.create = async (data) => {
  return await Product.create(data);
};

exports.findAll = () => {
  return Product.find(
    {},
    "product description calories protein carbs fats image price dietInfo vitamins minerals benefits unbenefits trending"
  );
};

exports.findAllAdmin = () => {
  return Product.find();
};

exports.findWithFilters = (filter = {}) => {
  return Product.find(filter)
    .populate({
      path: "province",
      select: "name",
    })
    .populate({
      path: "shop",
      select: "name city",
      populate: {
        path: "city",
        select: "name",
      },
    })
    .select("product description price trending shop province");
};
exports.findByName = async (name) => {
  return await Product.findOne({ product: new RegExp(`^${name}$`, "i") });
};

exports.findById = async (id) => {
  return await Product.findById(id)
    .select("-province")
    .populate({
      path: "shop",
      select: "name city address contact",
      populate: {
        path: "city",
        select: "name",
        populate: { path: "province", select: "name" },
      },
    });
};

exports.updateById = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

exports.deleteById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

exports.countDocument = async () => {
  return await Product.countDocuments();
};
