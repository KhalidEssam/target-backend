const { WorkOrder, OrderItem } = require("../models/WorkOrder");
const PartyOrganization = require('../models/PartyOrg');

// // Create a new work order
exports.createOrder = async (req, res) => {
    try {
        console.log("Creating new work order..." , req.body);
        const newOrder = new WorkOrder(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// // Get all work orders
exports.getAllOrders = async (req, res) => {
    try {
      console.log("Getting all work orders...");
        const orders = await WorkOrder.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// get all workorders by admin id
exports.getOrdersByAdminId = async (req, res) => {
  console.log("Getting all work orders by admin ID...");
  try {
    const orders = await WorkOrder.find({ adminId: req.params.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all workorders by partyorganization phoneNumber
exports.getOrdersByParty_phoneNumber = async (req, res) => {

    console.log("Getting all work orders by partyorganization phoneNumber...");
    try {
        const Orgz = await PartyOrganization.find({ phoneNumber: req.params.phoneNumber });

        if (!Orgz) {
            return res.status(404).json({ message: 'PartyOrganization not found' });
        }

        const orders = await WorkOrder.find({ partyId: Orgz[0]._id });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} // get all workorders by partyorganization phoneNumber 


// Get a single work order by ID
exports.getOrderById = async (req, res) => {
  console.log("Getting work order by ID...");
    try {
        const order = await WorkOrder.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a work order by ID
exports.updateOrder = async (req, res) => {
    console.log("Updating work order..." , req.body);
    try {
        const updatedOrder = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a work order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await WorkOrder.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create a new order item
exports.createOrderItem = async (req, res) => {
    try {
        console.log("Creating new order item..." , req.body);
        const newOrderItem = new OrderItem(req.body);
        const savedOrderItem = await newOrderItem.save();
        res.status(201).json(savedOrderItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all order items
exports.getAllOrderItems = async (req, res) => {
    try {
      console.log("Getting all order items...");
        const orderItems = await OrderItem.find();
        res.status(200).json(orderItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};      

// Get a single order item by ID
exports.getOrderItemById = async (req, res) => {
  console.log("Getting order item by ID...");
    try {
        const orderItem = await OrderItem.findById(req.params.id);
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        res.status(200).json(orderItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a order item by ID
exports.updateOrderItem = async (req, res) => {
    console.log("Updating order item..." , req.body);
    try {
        const updatedOrderItem = await OrderItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        res.status(200).json(updatedOrderItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a order item by ID
exports.deleteOrderItem = async (req, res) => {
    try {
        const deletedOrderItem = await OrderItem.findByIdAndDelete(req.params.id);
        if (!deletedOrderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        res.status(200).json({ message: 'Order item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};