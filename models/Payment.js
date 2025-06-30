const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WorkOrder",
    required: true
  },
  paymentId: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: "EGP",
    enum: ["USD", "EUR", "GBP", "EGP", "SAR"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "bank_transfer", "cash", "online" ,"other"],
    required: true
  },
  provider: { type: String, enum: ["Paymob", "Stripe", "Manual"], required: false },
  transactionId: {
    type: String,
    unique: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  refundDate: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Add indexes for efficient querying
PaymentSchema.index({ paymentId: 1 }, { unique: true, sparse: true });
PaymentSchema.index({ orderId: 1 }, { unique: true });
// PaymentSchema.index({ orderId: 1, paymentId: 1 }, { unique: true, sparse: true });
PaymentSchema.index({ status: 1 });

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
