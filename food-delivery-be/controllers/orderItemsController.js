const OrderItems = require('../models/orderItems');

// Get all order items
exports.getAllOrderItems = async (req, res) => {
    try {
        const orderItems = await OrderItems.findAll();
        res.status(200).json({ message: 'Order items retrieved successfully', orderItems });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order item by ID
exports.getOrderItemById = async (req, res) => {
    try {
        const { order_item_id } = req.params;
        const orderItem = await OrderItems.findById(order_item_id);
        
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        
        res.status(200).json({ message: 'Order item retrieved successfully', orderItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order items by order ID
exports.getOrderItemsByOrderId = async (req, res) => {
    try {
        const { order_id } = req.params;
        const orderItems = await OrderItems.findByOrderId(order_id);
        
        if (!orderItems || orderItems.length === 0) {
            return res.status(404).json({ message: 'No order items found for this order' });
        }
        
        res.status(200).json({ message: 'Order items retrieved successfully', orderItems });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order items with details
exports.getOrderItemsWithDetails = async (req, res) => {
    try {
        const { order_id } = req.params;
        const orderItems = await OrderItems.getOrderItemsWithDetails(order_id);
        
        if (!orderItems || orderItems.length === 0) {
            return res.status(404).json({ message: 'No order items found for this order' });
        }
        
        res.status(200).json({ message: 'Order items with details retrieved successfully', orderItems });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new order item
exports.createOrderItem = async (req, res) => {
    try {
        const { order_id, item_id, qty } = req.body;
        
        // Validate required fields
        if (!order_id || !item_id || !qty) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Validate numeric fields
        if (isNaN(qty) || qty <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive number' });
        }
        
        const orderItemId = await OrderItems.create({
            order_id,
            item_id,
            qty
        });
        
        const newOrderItem = await OrderItems.findById(orderItemId);
        res.status(201).json({ message: 'Order item created successfully', orderItem: newOrderItem });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update an order item
exports.updateOrderItem = async (req, res) => {
    try {
        const { order_item_id } = req.params;
        const updates = req.body;
        
        // Check if order item exists
        const existingOrderItem = await OrderItems.findById(order_item_id);
        if (!existingOrderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        
        // Validate numeric fields if they are being updated
        if (updates.qty !== undefined) {
            if (isNaN(updates.qty) || updates.qty <= 0) {
                return res.status(400).json({ message: 'Quantity must be a positive number' });
            }
        }
        
        const success = await OrderItems.update(order_item_id, updates);
        if (success) {
            const updatedOrderItem = await OrderItems.findById(order_item_id);
            res.status(200).json({ message: 'Order item updated successfully', orderItem: updatedOrderItem });
        } else {
            res.status(400).json({ message: 'Failed to update order item' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete an order item
exports.deleteOrderItem = async (req, res) => {
    try {
        const { order_id, item_id } = req.params;
        
        // Check if order item exists
        const existingOrderItem = await OrderItems.findById(order_id, item_id);
        if (!existingOrderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        
        const success = await OrderItems.delete(order_id, item_id);
        if (success) {
            res.status(200).json({ message: 'Order item deleted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to delete order item' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order total
exports.getOrderTotal = async (req, res) => {
    try {
        const { order_id } = req.params;
        const total = await OrderItems.getOrderTotal(order_id);
        
        res.status(200).json({ message: 'Order total retrieved successfully', total });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
