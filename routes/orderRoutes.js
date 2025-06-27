const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Order Routes
router.get("/orders", orderController.getAllOrders);
router.post("/orders", orderController.createOrder);
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);
router.get("/orders/admin/:id", orderController.getOrdersByAdminId);
router.get("/orders/party/:phoneNumber", orderController.getOrdersByParty_phoneNumber);

// OrderItem routes
router.get("/orderItems", orderController.getAllOrderItems);
router.post("/orderItems", orderController.createOrderItem);
router.get("/orderItems/:id", orderController.getOrderItemById);
router.put("/orderItems/:id", orderController.updateOrderItem);
router.delete("/orderItems/:id", orderController.deleteOrderItem);

module.exports = router; 