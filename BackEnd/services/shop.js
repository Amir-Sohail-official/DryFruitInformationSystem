const shopRepo = require("../repository/shop");
const City = require("../models/city");
const AppError = require("../util/app-errors");
exports.createShop = async (dataBody) => {
  if (!dataBody || Object.keys(dataBody).length === 0) {
    throw new AppError("No shop data provided", 400);
  }
  return await shopRepo.create(dataBody);
};
exports.getAllShops = async () => {
  const shops = await shopRepo.findAll();
  if (!shops.length) throw new AppError("No shops found", 404);
  return shops;
};
exports.getShopById = async (id) => {
  const shop = await shopRepo.findById(id);
  if (!shop) throw new AppError("No shop found with this ID", 404);
  return shop;
};
exports.updateShop = async (id, updatesData) => {
  const allowedUpdates = ["name", "address", "contact", "city"];
  const updates = { ...(updatesData || {}) };

  Object.keys(updates).forEach((key) => {
    if (!allowedUpdates.includes(key)) delete updates[key];
  });

  if (updates.city) {
    const cityExists = await City.findById(updates.city);
    if (!cityExists) {
      throw new AppError(`City with ID '${updates.city}' not found`, 404);
    }
  }

  const shop = await shopRepo.findByIdRaw(id);
  if (!shop) throw new AppError("Shop not found", 404);

  Object.assign(shop, updates);
  await shop.save();

  return shop;
};
exports.deleteShop = async (id) => {
  const shop = await shopRepo.deleteById(id);
  if (!shop) throw new AppError("No shop found with this ID", 404);
  return shop;
};
