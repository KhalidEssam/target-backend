const WorkOrder = require('../models/WorkOrder');

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


// exports.createOrder= async () => {
//   console.log("Creating new work order...");
//   const order = new WorkOrder({
//     type: "Suppliance",
//     adminId: "64fdec7a5b9345f2a9b800b4", // Replace with actual admin ID
//     items: [
//       {
//         type: "Equipment",
//         itemId: "64fdea2a3b42d3e45a8b002d", // Replace with actual vehicle ID
//         description: "Oil ceel is required",
//       },
//       {
//         type: "Equipment",
//         itemId: "64fdeab6f3245a9b6d7e003c", // Replace with actual equipment ID
//         description: " belt is required",
//       },
//     ],
//     description: "Urgent Suppliance required for listed items",
//     priority: "High",
//     status: "In Progress",
//   });

//   await order.save();
//   console.log("Order created successfully:", order);
// }

// createOrder();
