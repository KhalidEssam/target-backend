const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");


// OrderItem routes
router.get("/supply-items", orderController.getAllOrderItems);
router.post("/supply-items", orderController.createOrderItem);
router.get("/supply-items/:id", orderController.getOrderItemById);
router.put("/supply-items/:id", orderController.updateOrderItem);
router.delete("/supply-items/:id", orderController.deleteOrderItem);

module.exports = router; 