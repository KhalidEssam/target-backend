const crypto = require("crypto");
const WebSocket = require("ws");

// WebSocket setup
const wss = new WebSocket.Server({ noServer: true });
const clients = new Set();
wss.on("connection", (ws) => {
  console.log("✅ WebSocket connected");
  clients.add(ws);
  ws.on("close", () => {
    console.log("❌ WebSocket disconnected");
    clients.delete(ws);
  });
});

// Broadcast utility
const broadcastToClients = (message) => {
  const json = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log("📢 Broadcasting to client:", json);
      client.send(json);
    }
  });
};

// Webhook handler with full logs
exports.handlePaymentWebhook = async (req, res) => {
  try {
    console.log("🚀 Webhook Hit:");
    console.log("🔹 Method:", req.method);
    console.log("🔹 Headers:", JSON.stringify(req.headers, null, 2));
    console.log("🔹 Query:", JSON.stringify(req.query, null, 2));
    console.log("🔹 Body:", JSON.stringify(req.body, null, 2));

    const { hmac, obj } = req.body;

    if (!hmac || !obj) {
      console.error("❌ Missing hmac or obj in body");
      return res.status(400).json({ error: "Missing hmac or obj" });
    }

    const transaction_id = obj.id;
    const order_id = obj.order?.id;
    const success = obj.success;

    console.log("🧩 Extracted:");
    console.log("🔸 transaction_id:", transaction_id);
    console.log("🔸 order_id:", order_id);
    console.log("🔸 success:", success);
    console.log("🔸 received_hmac:", hmac);

    if (!transaction_id || !order_id || success === undefined) {
      console.error("❌ Missing required fields");
      return res.status(400).json({
        error: "Missing required transaction fields",
        details: { transaction_id, order_id, success },
      });
    }

    const secret = process.env.PAYMOB_SECRET_KEY;
    if (!secret) {
      console.error("❌ PAYMOB_SECRET_KEY is missing in env");
      return res.status(500).json({ error: "Secret key not configured" });
    }

    // Flatten nested fields
    const fields = [
      "amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction",
      "id", "integration_id", "is_3d_secure", "is_auth", "is_capture", "is_refunded",
      "is_standalone_payment", "is_voided", "order.id", "owner", "pending",
      "source_data.pan", "source_data.sub_type", "source_data.type", "success"
    ];

    const flatten = (obj) => {
      const res = {};
      const recurse = (cur, prefix = "") => {
        if (Object(cur) !== cur) {
          res[prefix] = cur;
        } else {
          for (const k in cur) {
            recurse(cur[k], prefix ? `${prefix}.${k}` : k);
          }
        }
      };
      recurse(obj);
      return res;
    };

    const flatObj = flatten(obj);
    const hmacString = fields.map((field) => flatObj[field] ?? "").join("");
    const calculatedHmac = crypto.createHmac("sha512", secret).update(hmacString).digest("hex");

    console.log("🔐 Calculated HMAC:", calculatedHmac);
    console.log("🔐 Received HMAC:", hmac);

    if (calculatedHmac !== hmac) {
      console.error("❌ HMAC validation failed");
      return res.status(401).json({ error: "Invalid HMAC" });
    }

    const status = success ? "success" : "failed";

    const payload = {
      type: "payment_status_update",
      transaction_id,
      order_id,
      status,
      details: obj,
    };

    console.log("✅ HMAC verified. Broadcasting:");
    console.log(JSON.stringify(payload, null, 2));
    broadcastToClients(payload);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔥 Webhook Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

// WebSocket route
exports.handleWebSocket = (req, socket, head) => {
  console.log("🔄 Upgrading HTTP to WebSocket");
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
};
