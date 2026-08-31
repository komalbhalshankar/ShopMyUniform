const express = require("express");
const Product = require("../models/Product");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// GET ALL PRODUCTS
// PUBLIC
// ==========================================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
});

// ==========================================
// GET PRODUCT BY ID
// PUBLIC
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get product",
      error: error.message,
    });
  }
});

// ==========================================
// CREATE PRODUCT
// ADMIN ONLY
// ==========================================

router.post(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const product = await Product.create(req.body);

      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Create product error:", error);

      res.status(500).json({
        message: "Failed to create product",
        error: error.message,
      });
    }
  }
);

// ==========================================
// UPDATE PRODUCT
// ADMIN ONLY
// ==========================================

router.put(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const product =
        await Product.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Update product error:", error);

      res.status(500).json({
        message: "Failed to update product",
        error: error.message,
      });
    }
  }
);

// ==========================================
// DELETE PRODUCT
// ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const product =
        await Product.findByIdAndDelete(
          req.params.id
        );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Delete product error:", error);

      res.status(500).json({
        message: "Failed to delete product",
        error: error.message,
      });
    }
  }
);

module.exports = router;