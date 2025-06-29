const express = require('express');
const router = express.Router();
const { getPaymobToken } = require('../controllers/paymentController');
const { initiatePayment } = require('../controllers/paymentsController');

// Get Paymob authentication token (internal use)
router.post('/paymob-token', getPaymobToken);

// Initiate Paymob payment
router.post('/payments/initiate', initiatePayment);

module.exports = router;
