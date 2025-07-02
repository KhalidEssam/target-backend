const crypto = require("crypto");
const WebSocket = require("ws");
const Payment = require("../models/Payment");
const { WorkOrder } = require("../models/WorkOrder");

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

// Webhook handler
exports.handlePaymentWebhook = async (req, res) => {
  try {
    const hmac = req.query.hmac;
    const obj = req.body.obj;

    if (!hmac || !obj) {
      console.error("❌ Missing hmac or obj in body");
      return res.status(400).json({ error: "Missing hmac or obj" });
    }

    const transaction_id = obj.id;
    const order_id = obj.order?.id;
    const success = obj.success;

    if (!transaction_id || !order_id || success === undefined) {
      return res.status(400).json({ error: "Missing transaction details" });
    }

    const secret = process.env.PAYMOB_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ error: "Missing PAYMOB_SECRET_KEY" });
    }

    // HMAC verification
    const fields = [
      "amount_cents", "created_at", "currency", "error_occured",
      "has_parent_transaction", "id", "integration_id", "is_3d_secure",
      "is_auth", "is_capture", "is_refunded", "is_standalone_payment",
      "is_voided", "order.id", "owner", "pending", "source_data.pan",
      "source_data.sub_type", "source_data.type", "success"
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

    if (calculatedHmac.toLowerCase() !== hmac.toLowerCase()) {
      console.error("❌ HMAC validation failed");
      return res.status(401).json({ error: "Invalid HMAC" });
    }

    const status = success ? "success" : "failed";

    // Lookup payment
    let payment = await Payment.findOne({ transactionId: transaction_id });

    if (!payment) {
      console.warn("⚠️ No payment with transactionId found. Trying fallback with metadata.paymob_order_id...");
      payment = await Payment.findOne({ "metadata.paymob_order_id": order_id });
      if (!payment) {
        console.error("❌ Payment not found by transaction or metadata");
        return res.status(404).json({ error: "Payment not found" });
      }
    }

    // Update payment
    payment.status = status === "success" ? "completed" : "failed";
    payment.transactionId = obj.id;
    payment.paymentId = obj.id;
    payment.provider = "Paymob";
    payment.paymentDate = new Date(obj.created_at);
    payment.metadata = obj;
    await payment.save();

    // Update associated WorkOrder
    const workOrder = await WorkOrder.findById(payment.orderId).populate("payments");
    if (workOrder) {
      const paidAmount = workOrder.payments.reduce((sum, p) => (
        p.status === "completed" ? sum + p.amount : sum
      ), 0);

      workOrder.paidAmount = paidAmount;
      workOrder.paymentStatus =
        paidAmount >= workOrder.totalAmount
          ? "paid"
          : paidAmount > 0
          ? "partially_paid"
          : "pending";

      workOrder.lastPaymentDate = new Date();
      await workOrder.save();
    }

    // Notify frontend
    const payload = {
      type: "payment_status_update",
      transaction_id,
      order_id,
      status,
      details: obj
    };

    console.log("✅ Payment updated and broadcasting to clients");
    broadcastToClients(payload);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔥 Webhook Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

// WebSocket upgrade
exports.handleWebSocket = (req, socket, head) => {
  console.log("🔄 Upgrading HTTP to WebSocket");
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
};
