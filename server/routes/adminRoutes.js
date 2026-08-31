const express = require("express");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// ADMIN DASHBOARD STATISTICS
// ==========================================

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const totalParents = await User.countDocuments({
      role: "parent",
    });

    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const completedOrders = await Order.countDocuments({
      status: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      status: "Cancelled",
    });

    const orders = await Order.find();

    const totalSales = orders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0
    );

    res.json({
      totalUsers,
      totalStudents,
      totalParents,
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalSales,
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
});

// ==========================================
// GET ALL USERS
// ==========================================

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.json({
      users,
    });
  } catch (error) {
    console.error("Admin users error:", error);

    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

// ==========================================
// GET ALL ORDERS
// ==========================================

router.get("/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json({
      orders,
    });
  } catch (error) {
    console.error("Admin orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

router.put(
  "/orders/:orderId/status",
  protect,
  adminOnly,
  async (req, res) => {
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

      // Check valid status
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      // ==========================================
      // UPDATE ONLY THE STATUS
      // ==========================================

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          $set: {
            status: status,
          },
        },
        {
          new: true,
        }
      );

      // Check order
      if (!updatedOrder) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      // ==========================================
      // SEND UPDATED ORDER
      // ==========================================

      res.json({
        message: "Order status updated successfully",
        order: updatedOrder,
      });

    } catch (error) {
      console.error(
        "Update order status error:",
        error
      );

      res.status(500).json({
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }
);

// ==========================================
// DELETE USER
// ==========================================

router.delete("/users/:userId", protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin users cannot be deleted",
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;