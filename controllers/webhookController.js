const WebSocket = require('ws');
const express = require('express');
const crypto = require('crypto');
const querystring = require('querystring');

// Initialize WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Store connected clients
const clients = new Set();

// Handle new WebSocket connections
wss.on('connection', (ws) => {
  clients.add(ws);
  
  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Function to broadcast messages to all connected clients
const broadcastToClients = (message) => {
  const jsonMessage = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(jsonMessage);
    }
  });
};

// Webhook endpoint to handle PayMob transaction notifications

exports.handlePaymentWebhook = async (req, res) => {
    try {
        console.log("hiiiiiiii from websocket");
      // Support both POST JSON body and GET query params
      const params = req.method === 'POST' ? req.body : req.query;
  
      // Validate required params
      const { id: transaction_id, success, merchant_order_id: order_id, hmac } = params;
      if (!transaction_id || !success || !order_id || !hmac) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
  
      const secret = process.env.PAYMOB_SECRET_KEY;
      if (!secret) {
        return res.status(500).json({ error: 'PAYMOB_SECRET_KEY not configured' });
      }
  
      // Construct string to hash from sorted params (excluding hmac)
      const stringToHash = Object.keys(params)
        .filter(key => key !== 'hmac')
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
  
      // Generate HMAC with your secret
      const calculatedHmac = crypto.createHmac('sha256', secret).update(stringToHash).digest('hex');
  
      // Timing-safe compare
      const hmacBuffer = Buffer.from(hmac, 'hex');
      const calculatedBuffer = Buffer.from(calculatedHmac, 'hex');
      if (
        hmacBuffer.length !== calculatedBuffer.length ||
        !crypto.timingSafeEqual(hmacBuffer, calculatedBuffer)
      ) {
        return res.status(401).json({ error: 'Invalid HMAC signature' });
      }
  
      // Map success to your internal status
      const status = success === 'true' ? 'success' : 'failed';
  
      // Broadcast payment update to WebSocket clients
      broadcastToClients({
        type: 'payment_status_update',
        transaction_id,
        status,
        order_id,
        details: params
      });
  
      // TODO: Insert database update logic here to save transaction status securely
  
      // Respond OK to Paymob
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error handling Paymob webhook:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Middleware to handle WebSocket connections
exports.handleWebSocket = (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
};
