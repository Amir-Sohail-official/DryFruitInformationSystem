const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");
const authMiddleWare = require("../middleware/auth");
const opitionalAuth = require("../middleware/optionalAuth");
const upload = require("../middleware/upload");

/**
 * @route POST /
 * @description Create a new product
 * @access Public
 */
router
  .route("/")
  .post(upload.single("image"), productController.createProduct)

  /**
   * @route GET /
   * @description Get all products
   * @access Protected
   */
  .get(opitionalAuth.optionalAuth, productController.getAllProducts);

/**
 * @route GET /search
 * @description Search products by filters (province, price, trending)
 * @query {string} province - Province name
 * @query {number} price - Max price
 * @query {boolean} trending - true/false
 * @access Public
 */
router.get("/search", productController.searchProducts);

/**
 * @route GET /by-name/:name
 * @description Get a product by name
 * @param {string} name - Product name
 * @access Public
 */
router.get("/by-name/:name", productController.getProductByName);
router
  .route("/:id")
  .get(productController.getProduct)

  /**
   * @route PATCH /:id
   * @description Update a product by ID (partial update)
   * @param {string} id - Product ID
   * @access Public
   */
  .patch(upload.single("image"), productController.updateProduct)

  /**
   * @route DELETE /:id
   * @description Delete a product by ID
   * @param {string} id - Product ID
   * @access Admin
   */
  .delete(
    authMiddleWare.protect,
    authMiddleWare.restrictTo("admin"),
    productController.deleteProduct
  );

module.exports = router;
