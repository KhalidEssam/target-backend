const { WorkOrder, OrderItem } = require("../models/WorkOrder");
const PartyOrganization = require('../models/PartyOrg');
const Payment = require('../models/Payment');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');

// Create a new work order with payment information
exports.createOrder = asyncHandler(async (req, res) => {
    try {
      const {
        type,
        items,
        adminId,
        partyId,
        description,
        paymentDueDate,
        paymentMethod,
        ...rest
      } = req.body;
  
      // Calculate total amount from items if not provided
      let calculatedTotalAmount = 0;
      if (items) {
        items.forEach(item => {
          if (item.quantity && item.price) {
            calculatedTotalAmount += item.quantity * item.price;
          }
        });
      }
  
      // Use provided totalAmount or calculated one
      const orderTotalAmount = req.body.totalAmount || calculatedTotalAmount;
  
      // Create the order
      const order = new WorkOrder({
        type,
        items,
        adminId,
        partyId,
        description,
        totalAmount: orderTotalAmount,
        paymentDueDate,
        status: "Pending",
        paymentStatus: "pending",
        ...rest
      });
  
      // Save the order first to get orderId
      const savedOrder = await order.save();
  
      // Handle offline payment (e.g., cash on delivery)
      if (paymentMethod && ["cash", "manual", "bank_transfer"].includes(paymentMethod)) {
        const payment = new Payment({
          orderId: savedOrder._id,
          amount: orderTotalAmount,
          paymentMethod,
          paymentDate: new Date(),
          provider: "Manual",
          status: "pending"
        });
  
        const savedPayment = await payment.save();
        savedOrder.payments.push(savedPayment._id);
        await savedOrder.save();
      }
  
      res.status(201).json(savedOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(400).json({ message: error.message });
    }
  });
  

// Get all work orders
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

// Get a single work order by ID with payments
exports.getOrderById = asyncHandler(async (req, res) => {
    try {
        const order = await WorkOrder.findById(req.params.id)
            .populate('payments', 'paymentId amount status paymentMethod transactionId paymentDate');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Calculate payment status based on payments
        if (order.payments && order.payments.length > 0) {
            const totalPaid = order.payments.reduce((sum, payment) => {
                if (payment.status === 'completed') {
                    return sum + payment.amount;
                }
                return sum;
            }, 0);

            if (totalPaid >= order.totalAmount) {
                order.paymentStatus = 'paid';
            } else if (totalPaid > 0) {
                order.paymentStatus = 'partially_paid';
            }
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update a work order by ID including payment status
exports.updateOrder = asyncHandler(async (req, res) => {
    try {
        const { 
            status,
            paymentStatus,
            totalAmount,
            paymentMethod,
            paymentDueDate,
            ...rest
        } = req.body;

        const order = await WorkOrder.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update payment status if provided
        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        // Update total amount if provided
        if (totalAmount) {
            order.totalAmount = totalAmount;
        }

        // Update payment due date if provided
        if (paymentDueDate) {
            order.paymentDueDate = paymentDueDate;
        }

        // Update other fields
        order.status = status || order.status;
        
        // Save the order first to get updated orderId
        const updatedOrder = await order.save();

        // If paymentMethod is provided, create or update payment
        if (paymentMethod) {
            // Check if there's an existing payment
            const existingPayment = await Payment.findOne({ orderId: updatedOrder._id });
            
            if (existingPayment) {
                existingPayment.paymentMethod = paymentMethod;
                existingPayment.status = "pending";
                await existingPayment.save();
            } else {
                const newPayment = new Payment({
                    orderId: updatedOrder._id,
                    amount: totalAmount || updatedOrder.totalAmount,
                    paymentMethod,
                    status: "pending"
                });
                const savedPayment = await newPayment.save();
                updatedOrder.payments.push(savedPayment._id);
                await updatedOrder.save();
            }
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(400).json({ message: error.message });
    }
});

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