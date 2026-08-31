const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const router = express.Router();

// ==========================================
// GEMINI CLIENT
// ==========================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ==========================================
// AI CUSTOMER SUPPORT CHAT
// ==========================================

router.post("/chat", async (req, res) => {
  try {
    const {
      message,
      userId,
      conversation = [],
    } = req.body;

    // ==========================================
    // VALIDATE MESSAGE
    // ==========================================

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const userMessage = message.trim();

    // ==========================================
    // GET USER
    // ==========================================

    let user = null;

    if (userId) {
      user = await User.findById(userId).select("-password");
    }

    // ==========================================
    // GET USER ORDERS
    // ==========================================

    let orders = [];

    if (userId) {
      orders = await Order.find({
        userId,
      }).sort({
        createdAt: -1,
      });
    }

    // ==========================================
    // GET PRODUCTS
    // ==========================================

    const products = await Product.find()
      .limit(50)
      .lean();

    // ==========================================
    // PREPARE USER DATA
    // ==========================================

    const userData = user
      ? {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          school: user.school,
          studentClass: user.studentClass,
        }
      : null;

    // ==========================================
    // PREPARE ORDER DATA
    // ==========================================

    const orderData = orders.map((order) => ({
      id: order._id.toString().slice(-6),

      fullId: order._id.toString(),

      status: order.status,

      totalAmount: order.totalAmount,

      createdAt: order.createdAt,

      items: order.items.map((item) => ({
        productId: item.productId
          ? item.productId.toString()
          : null,

        name: item.name,

        price: item.price,

        quantity: item.quantity,
      })),
    }));

    // ==========================================
    // PREPARE PRODUCT DATA
    // ==========================================

    const productData = products.map((product) => ({
      id: product._id.toString(),

      name: product.name,

      category: product.category,

      description: product.description,

      price: product.price,

      size: product.size,

      stock: product.stock,
    }));

    // ==========================================
    // RETURN / EXCHANGE DETECTION
    // ==========================================

    const isReturnOrExchange =
      userMessage.toLowerCase().includes("return") ||
      userMessage.toLowerCase().includes("exchange") ||
      userMessage.toLowerCase().includes("refund");

    // ==========================================
    // FIND ORDER NUMBER FROM MESSAGE
    // ==========================================

    let requestedOrder = null;

    const orderIdMatch =
      userMessage.match(
        /(?:order\s*(?:id|number|no|#)?\s*)?#?([a-f0-9]{6})\b/i
      );

    if (orderIdMatch && orders.length > 0) {
      const requestedOrderId =
        orderIdMatch[1].toLowerCase();

      requestedOrder = orders.find(
        (order) =>
          order._id
            .toString()
            .slice(-6)
            .toLowerCase() ===
          requestedOrderId
      );
    }

    // ==========================================
    // RETURN / EXCHANGE DATABASE CHECK
    // ==========================================

    if (isReturnOrExchange) {
      // ------------------------------------------
      // USER NOT LOGGED IN
      // ------------------------------------------

      if (!userId || !user) {
        return res.json({
          reply:
            "Please login first so I can check your actual order and help with your return or exchange request.",
        });
      }

      // ------------------------------------------
      // NO ORDERS
      // ------------------------------------------

      if (orders.length === 0) {
        return res.json({
          reply:
            "I couldn't find any orders for your account, so I can't verify a return or exchange request yet.",
        });
      }

      // ------------------------------------------
      // ORDER NUMBER PROVIDED
      // ------------------------------------------

      if (requestedOrder) {
        const matchingItems =
          requestedOrder.items.filter((item) =>
            userMessage
              .toLowerCase()
              .includes(
                item.name.toLowerCase()
              )
          );

        if (matchingItems.length > 0) {
          const itemNames =
            matchingItems
              .map(
                (item) =>
                  `${item.name} × ${item.quantity}`
              )
              .join(", ");

          return res.json({
            reply:
              `I found order #${requestedOrder._id
                .toString()
                .slice(-6)} in your account. It contains ${itemNames} and its current status is ${requestedOrder.status}. The order data confirms the item is part of your order. The specific return/exchange eligibility policy is not currently stored in the application, so I cannot claim eligibility without that policy information.`,
          });
        }

        return res.json({
          reply:
            `I found order #${requestedOrder._id
              .toString()
              .slice(-6)}, but I couldn't find the specific item you mentioned in that order. Please check the item name or order number.`,
        });
      }

      // ------------------------------------------
      // NO ORDER NUMBER
      // CHECK ALL USER ORDERS
      // ------------------------------------------

      const allOrderedItems = [];

      orders.forEach((order) => {
        order.items.forEach((item) => {
          allOrderedItems.push({
            orderId: order._id
              .toString()
              .slice(-6),

            orderStatus: order.status,

            name: item.name,

            quantity: item.quantity,
          });
        });
      });

      // ------------------------------------------
      // FIND ITEM MENTIONED IN MESSAGE
      // ------------------------------------------

      const matchingUserItems =
        allOrderedItems.filter((item) =>
          userMessage
            .toLowerCase()
            .includes(
              item.name.toLowerCase()
            )
        );

      if (matchingUserItems.length > 0) {
        const itemInfo =
          matchingUserItems
            .map(
              (item) =>
                `${item.name} × ${item.quantity} in order #${item.orderId} (${item.orderStatus})`
            )
            .join(", ");

        return res.json({
          reply:
            `I found the item in your actual orders: ${itemInfo}. The application currently does not store a specific return/exchange eligibility policy, so I won't invent one. If you provide the order number, I can verify the exact order and item for your request.`,
        });
      }

      // ------------------------------------------
      // USER HAS ORDERS BUT ITEM NOT FOUND
      // ------------------------------------------

      return res.json({
        reply:
          "I checked your actual orders, but I couldn't find the item you mentioned. Please tell me the order number or the exact product name so I can check it.",
      });
    }

    // ==========================================
    // DATABASE CONTEXT
    // ==========================================

    const databaseContext = `
SHOPMYUNIFORM DATABASE

USER:
${JSON.stringify(
  userData,
  null,
  2
)}

USER ORDERS:
${JSON.stringify(
  orderData,
  null,
  2
)}

AVAILABLE PRODUCTS:
${JSON.stringify(
  productData,
  null,
  2
)}
`;

    // ==========================================
    // CONVERSATION HISTORY
    // ==========================================

    let historyText = "";

    if (Array.isArray(conversation)) {
      historyText = conversation
        .slice(-10)
        .map(
          (chat) =>
            `${
              chat.sender === "user"
                ? "USER"
                : "ASSISTANT"
            }: ${chat.text}`
        )
        .join("\n");
    }

    // ==========================================
    // AI PROMPT
    // ==========================================

    const prompt = `
You are the official ShopMyUniform AI Customer Support Agent.

ShopMyUniform is a school-uniform e-commerce website.

Help customers with:

- Products
- Product prices
- Product availability
- Sizes
- Stock
- Orders
- Order status
- Delivery
- Returns
- Exchanges
- General shopping questions

IMPORTANT RULES:

1. Use ONLY the database information provided below.

2. NEVER invent products, prices, stock, orders, order statuses or customer information.

3. If the user asks about THEIR order, use their actual orders from the database.

4. If the user is not logged in and asks about their personal order, tell them to login.

5. If the user has no orders, clearly say that no orders were found.

6. Use actual product prices, sizes and stock from the database.

7. If information is unavailable, clearly say that it is unavailable.

8. Keep responses short, friendly and professional.

9. Never reveal passwords, API keys, JWT secrets, MongoDB credentials or other sensitive information.

10. Use conversation history to understand follow-up questions.

11. If the user asks about a specific order, use the matching order from the database.

12. Do not assume that an order is eligible for return or exchange unless the database contains the relevant policy or eligibility information.

13. Do not invent a return period such as 7 days, 15 days or 30 days.

14. Do not claim that a refund has been approved unless the application data says so.

DATABASE INFORMATION:

${databaseContext}

CONVERSATION HISTORY:

${historyText}

CURRENT USER MESSAGE:

${userMessage}

Answer the user's current question.
`;

    // ==========================================
    // CALL GEMINI
    // ==========================================

    const response =
      await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",

        contents: prompt,

        config: {
          temperature: 0.3,
          maxOutputTokens: 300,
        },
      });

    // ==========================================
    // GET RESPONSE
    // ==========================================

    const reply =
      response.text ||
      "Sorry, I couldn't generate a response right now.";

    // ==========================================
    // SEND RESPONSE
    // ==========================================

    res.json({
      reply,
    });
  } catch (error) {
    console.error(
      "Gemini AI error:",
      error
    );

    res.status(500).json({
      message: "AI support failed",
      error: error.message,
    });
  }
});

// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;