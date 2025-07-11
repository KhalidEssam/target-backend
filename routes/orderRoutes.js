const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: List of orders
 *   post:
 *     summary: Create a new order
 *     responses:
 *       201:
 *         description: Order created
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order data
 *   put:
 *     summary: Update order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order updated
 *   delete:
 *     summary: Delete order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Order deleted
 * /orders/admin/{id}:
 *   get:
 *     summary: Get orders by admin ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders for admin
 * /orders/party/{phoneNumber}:
 *   get:
 *     summary: Get orders by party phone number
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orders for party
 * /orderItems:
 *   get:
 *     summary: Get all order items
 *     responses:
 *       200:
 *         description: List of order items
 *   post:
 *     summary: Create a new order item
 *     responses:
 *       201:
 *         description: Order item created
 * /orderItems/{id}:
 *   get:
 *     summary: Get order item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order item data
 *   put:
 *     summary: Update order item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order item updated
 *   delete:
 *     summary: Delete order item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Order item deleted
 */

// Order Routes
router.get("/orders", orderController.getAllOrders);
router.post("/orders", orderController.createOrder);
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/:id", orderController.updateOrder);
router.delete("/orders/:id", orderController.deleteOrder);
router.get("/orders/admin/:id", orderController.getOrdersByAdminId);
router.get("/orders/user/:id",orderController.getOrdersByUserId)
router.get("/orders/party/:phoneNumber", orderController.getOrdersByParty_phoneNumber);

// OrderItem routes
router.get("/orderItems", orderController.getAllOrderItems);
router.post("/orderItems", orderController.createOrderItem);
router.get("/orderItems/:id", orderController.getOrderItemById);
router.put("/orderItems/:id", orderController.updateOrderItem);
router.delete("/orderItems/:id", orderController.deleteOrderItem);

module.exports = router; 