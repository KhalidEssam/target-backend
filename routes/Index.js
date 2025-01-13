// routes/index.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// Import order controller
const orderController = require('../controllers/orderController');

// Home route
router.get('/', userController.home);

// Other routes for user-related actions (e.g., login, registration, etc.)
router.get('/user/:id', userController.getUser);

// Order Routes
router.get('/orders', orderController.getAllOrders);
router.post('/orders', orderController.createOrder);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id', orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);


module.exports = router;
