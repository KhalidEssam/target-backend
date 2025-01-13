// routes/index.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// Import order controller
const orderController = require('../controllers/orderController');


// Import party controller
const partyController = require('../controllers/partyController');

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




// PartyOrg routes


// PartyOrg routes
router.get('/parties', partyController.getAllParties);
router.post('/parties', partyController.createParty);
router.get('/parties/:id', partyController.getPartyById);
router.put('/parties/:id', partyController.updateParty);    
router.delete('/parties/:id', partyController.deleteParty);
router.get('/parties/type/:type', partyController.getPartyByType);







module.exports = router;
