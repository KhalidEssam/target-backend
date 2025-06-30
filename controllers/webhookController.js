const WebSocket = require("ws");
const express = require("express");
const crypto = require("crypto");
const querystring = require("querystring");

// Initialize WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Store connected clients
const clients = new Set();

// Handle new WebSocket connections
wss.on("connection", (ws) => {
  clients.add(ws);

  ws.on("close", () => {
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
        console.log("Raw request body:", JSON.stringify(req.body, null, 2));
        console.log("Query params:", req.query);

        // PayMob sends HMAC as query parameter and data in JSON body
        const payload = req.body;
        const hmac = req.query.hmac;

        if (!payload || typeof payload !== 'object') {
            return res.status(400).json({ error: 'Invalid payload format' });
        }

        // Extract parameters from the correct locations
        const transaction_id = payload.obj?.id || payload.id;
        const success = payload.success || 
                       payload.obj?.success || 
                       (payload.obj?.migs_result === 'SUCCESS') || 
                       (payload.obj?.txn_response_code === 'APPROVED');
        const order_id = payload.obj?.order?.id || 
                        payload.obj?.order_info || 
                        payload.payment_key_claims?.order_id;

        console.log("Extracted parameters:", {
            transaction_id,
            success,
            order_id,
            hmac
        });

        if (!transaction_id || success === undefined || !order_id || !hmac) {
            console.error("Missing parameters:", { 
                transaction_id, 
                success, 
                order_id, 
                hmac 
            });
            return res.status(400).json({ 
                error: 'Missing required parameters',
                details: {
                    received_hmac: !!hmac,
                    received_transaction_id: !!transaction_id,
                    received_success: success !== undefined,
                    received_order_id: !!order_id
                }
            });
        }

        const secret = process.env.PAYMOB_SECRET_KEY;
        if (!secret) {
            return res.status(500).json({ error: 'PAYMOB_SECRET_KEY not configured' });
        }

        // Construct string to hash from the JSON payload
        const stringToHash = JSON.stringify(payload)
            .replace(/\//g, '\\/')  // Escape forward slashes
            .replace(/\s+/g, '');    // Remove whitespace

        // Generate HMAC
        const calculatedHmac = crypto.createHmac('sha256', secret)
                                   .update(stringToHash)
                                   .digest('hex');

        // Timing-safe compare
        if (!crypto.timingSafeEqual(
            Buffer.from(hmac, 'hex'),
            Buffer.from(calculatedHmac, 'hex')
        )) {
            console.error("HMAC validation failed");
            return res.status(401).json({ error: 'Invalid HMAC signature' });
        }

        // Determine payment status
        const status = success ? 'success' : 'failed';

        // Broadcast to WebSocket clients
        broadcastToClients({
            type: 'payment_status_update',
            transaction_id,
            status,
            order_id,
            details: payload
        });

        // Respond to PayMob
        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error handling Paymob webhook:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
};

// Middleware to handle WebSocket connections
exports.handleWebSocket = (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
};
