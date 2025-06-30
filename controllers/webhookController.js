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

// 👇 Correct Webhook Handler
exports.handlePaymentWebhook = async (req, res) => {
  try {
    const { hmac, obj } = req.body;

    if (!hmac || !obj) {
      return res.status(400).json({ error: 'Missing HMAC or obj payload' });
    }

    const transaction_id = obj.id;
    const order_id = obj.order?.id;
    const success = obj.success;

    if (!transaction_id || !order_id || success === undefined) {
      return res.status(400).json({ error: 'Missing transaction details' });
    }

    const secret = process.env.PAYMOB_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ error: 'PAYMOB_SECRET_KEY not set' });
    }

    // 👇 Follow Paymob's exact order of HMAC fields
    const fields = [
      'amount_cents', 'created_at', 'currency', 'error_occured', 'has_parent_transaction',
      'id', 'integration_id', 'is_3d_secure', 'is_auth', 'is_capture', 'is_refunded',
      'is_standalone_payment', 'is_voided', 'order.id', 'owner', 'pending',
      'source_data.pan', 'source_data.sub_type', 'source_data.type', 'success'
    ];

    const flat = (obj) => {
      const result = {};
      const recurse = (cur, prop) => {
        if (Object(cur) !== cur) result[prop] = cur;
        else for (const key in cur) recurse(cur[key], prop ? `${prop}.${key}` : key);
      };
      recurse(obj, '');
      return result;
    };

    const flatObj = flat(obj);
    const hmacString = fields.map((key) => flatObj[key] ?? '').join('');
    const calculatedHmac = crypto.createHmac('sha512', secret).update(hmacString).digest('hex');

    if (calculatedHmac !== hmac) {
      console.error('HMAC mismatch');
      return res.status(401).json({ error: 'Invalid HMAC' });
    }

    const status = success ? 'success' : 'failed';

    // ✅ Broadcast to frontend via WebSocket
    broadcastToClients({
      type: 'payment_status_update',
      transaction_id,
      status,
      order_id,
      details: obj
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

exports.handleWebSocket = (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
};

