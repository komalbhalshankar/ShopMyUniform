const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// ==========================================
// CREATE NEW ORDER
// ==========================================

router.post("/", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    // Check user
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    // Check cart
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Create order
    const order = new Order({
      userId,
      items,
      totalAmount,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
});

// ==========================================
// GET ORDERS FOR A USER
// ==========================================

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// ==========================================
// GET ALL ORDERS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({
        createdAt: -1,
      });

    res.json({
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

router.patch("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    // Check status
    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    // Find and update order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE ORDER
// ==========================================

router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);

    res.status(500).json({
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

module.exports = router;