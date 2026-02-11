const productRepo = require("../repository/product");
const AppError = require("../util/app-errors");
const provinceRepo = require("../repository/province");
const Fuse = require("fuse.js");

exports.searchProducts = async (filters = {}) => {
  const match = {};

  console.log("Search filters received:", filters);

  // Handle province filter
  if (filters.province) {
    const provinces = await provinceRepo.findAll({}, "name _id");
    const fuse = new Fuse(provinces, { keys: ["name"], threshold: 0.4 });
    const result = fuse.search(filters.province.trim());
    if (result.length > 0) {
      const matchedProvince = result[0].item;
      match.province = matchedProvince._id;
      console.log("Matched province:", matchedProvince.name);
    } else {
      // If no exact match, try case-insensitive search
      const provinceMatch = provinces.find(p => 
        p.name.toLowerCase().includes(filters.province.toLowerCase().trim())
      );
      if (provinceMatch) {
        match.province = provinceMatch._id;
        console.log("Matched province (partial):", provinceMatch.name);
      }
    }
  }

  // Handle trending filter
  if (filters.trending) {
    // Accept "true", true, or "trending" as valid values
    if (filters.trending === "true" || filters.trending === true || 
        filters.trending.toString().toLowerCase().includes("trend")) {
      match.trending = true;
      console.log("Trending filter applied");
    }
  }

  // Handle price filter - support both exact and max price
  if (filters.price) {
    const priceNum = Number(filters.price);
    if (!isNaN(priceNum) && priceNum > 0) {
      // Search for products with price less than or equal to the specified price
      match.price = { $lte: priceNum };
      console.log("Price filter applied:", priceNum);
    }
  }

  console.log("Final match criteria:", match);

  let products = await productRepo.findWithFilters(match);

  // If no filters matched or no results, try searching by product name/description
  if (products.length === 0 && Object.keys(filters).length > 0) {
    const allProducts = await productRepo.findAll();
    const searchTerms = [];
    
    if (filters.province) searchTerms.push(filters.province.toLowerCase());
    
    if (searchTerms.length > 0) {
      products = allProducts.filter((p) => {
        const productName = p.product?.toLowerCase() || "";
        const description = p.description?.toLowerCase() || "";
        return searchTerms.some(term => 
          productName.includes(term) || description.includes(term)
        );
      });
    }
  }
  
  // If still no results and we have a price filter, search all products by price
  if (products.length === 0 && filters.price) {
    const allProducts = await productRepo.findAll();
    products = allProducts.filter((p) => p.price && p.price <= filters.price);
  }

  console.log("Search results count:", products.length);

  return products;
};

exports.createProduct = async (data) => {
  if (!data || Object.keys(data).length === 0) {
    throw new AppError("Product data is required", 400);
  }
  return await productRepo.create(data);
};
exports.getAllProducts = async (isAdmin = false, page, limit) => {
  if (isAdmin) {
    const skip = (page - 1) * limit;
    const totalProducts = await productRepo.countDocument();

    const products = await productRepo
      .findAllAdmin()
      .skip(skip)
      .limit(limit)
      .populate({
        path: "shop",
        select: "name contact address city ",
        populate: {
          path: "city",
          select: "name province ",
          populate: {
            path: "province",
            select: "name -_id",
          },
        },
      })
      .populate("province", "name");

    return {
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    };
  }

  const products = await productRepo.findAll().populate({
    path: "shop",
    select: "name contact address city -_id",
    populate: {
      path: "city",
      select: "name province -_id",
      populate: {
        path: "province",
        select: "name -_id",
      },
    },
  });

  // Return empty array instead of throwing error for better UX
  // Frontend can handle empty array gracefully
  return { products: products || [] };
};
exports.getProductByName = async (name) => {
  const product = await productRepo.findByName(name);
  if (!product) throw new AppError(`No product found for: ${name}`, 404);
  return product;
};

exports.getProductById = async (id) => {
  const product = await productRepo.findById(id);
  if (!product) throw new AppError(`No product found with ID: ${id}`, 404);
  return product;
};

exports.updateProduct = async (id, updates) => {
  const updatedProduct = await productRepo.updateById(id, updates);
  if (!updatedProduct)
    throw new AppError(`No product found with ID: ${id}`, 404);
  return updatedProduct;
};

exports.deleteProduct = async (id) => {
  const deletedProduct = await productRepo.deleteById(id);
  if (!deletedProduct)
    throw new AppError(`No product found with ID: ${id}`, 404);
  return deletedProduct;
};
