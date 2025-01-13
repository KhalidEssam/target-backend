const mongoose = require("mongoose");

// Sub-schema for order items (vehicles or equipment)
const OrderItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Vehicle", "Equipment"], // Specify whether the item is a vehicle or equipment
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the item's unique ID
    required: true,
    refPath: "items.type", // Dynamic reference to 'Vehicle' or 'Equipment' collection
  },
  description: String, // Optional description of the item
});

// Main Work Order Schema
const WorkOrderSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Maintenance", "Suppliance"], // Order type: Maintenance or Suppliance
      required: true,
    },
    items: [OrderItemSchema], // Array of vehicles or equipment involved in the order
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Reference to the admin who created the order
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"], // Status of the order
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"], // Priority level
      default: "Medium",
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set creation date
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically set update date
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create models
const WorkOrder = mongoose.model("WorkOrder", WorkOrderSchema);

module.exports = WorkOrder;
