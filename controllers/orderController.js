const Order = require('../models/Order');

// 1. Get user's order history
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
};

// 2. Get single order details
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        
        // Ensure user can only see their own orders
        if (order.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error });
    }
};
