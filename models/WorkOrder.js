const mongoose = require("mongoose");
const PartyOrganization = require("../models/PartyOrg");

const OrderItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Vehicle", "Equipment"],
    required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
    default: 1,
  },
  description: String,
  imageUrls: [String],
});

const WorkOrderSchema = new mongoose.Schema(
  {
    orderMode: {
      type: String,
      enum: ["B2B", "B2C"],
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Maintenance",
        "Suppliance",
        "Consultation",
        "Construction",
        "Store",
      ],
      required: true,
    },

    items: {
      type: [OrderItemSchema],
      validate: [(val) => val.length > 0, "Order must have at least one item"],
    },

    adminId: {
      type: String,
      ref: "Admin",
      required: function () {
        return this.orderMode === "B2B";
      },
    },

    partyId: {
      type: String,
      ref: "PartyOrganization",
      required: function () {
        return this.orderMode === "B2B";
      },
      validate: {
        isAsync: true,
        validator: async function (v) {
          const count = await PartyOrganization.countDocuments({ _id: v });
          return count > 0;
        },
      },
    },

    userId: {
      type: String,
      ref: "User",
      required: function () {
        return this.orderMode === "B2C";
      },
    },

    description: String,

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "partially_paid", "overdue", "refunded"],
      default: "pending",
    },

    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],

    lastPaymentDate: Date,

    paymentDueDate: Date,

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Create models
const WorkOrder = mongoose.model("WorkOrder", WorkOrderSchema);
const OrderItem = mongoose.model("OrderItem", OrderItemSchema);

module.exports = { WorkOrder, OrderItem };
