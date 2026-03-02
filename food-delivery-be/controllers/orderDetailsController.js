const OrderDetails = require('../models/orderDetails');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderDetails.findAll();
    res.status(200).json({ message: 'Orders retrieved successfully', orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await OrderDetails.findById(order_id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json({ message: 'Order retrieved successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order with full details (including user, address, and payment info)
exports.getOrderWithDetails = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await OrderDetails.getOrderWithDetails(order_id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.status(200).json({ message: 'Order details retrieved successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { email_address, address_id, card_number, total_price } = req.body;
    
    // Validate required fields
    if (!email_address || !address_id || !card_number || !total_price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate total_price is a positive number
    if (isNaN(total_price) || total_price <= 0) {
      return res.status(400).json({ message: 'Total price must be a positive number' });
    }
    
    const newOrder = await OrderDetails.create({ 
      email_address, 
      address_id, 
      card_number, 
      total_price 
    });
    
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const updates = req.body;
    
    // Check if order exists
    const existingOrder = await OrderDetails.findById(order_id);
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Validate total_price if it's being updated
    if (updates.total_price !== undefined) {
      if (isNaN(updates.total_price) || updates.total_price <= 0) {
        return res.status(400).json({ message: 'Total price must be a positive number' });
      }
    }
    
    const success = await OrderDetails.update(order_id, updates);
    if (success) {
      const updatedOrder = await OrderDetails.findById(order_id);
      res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } else {
      res.status(400).json({ message: 'Failed to update order' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    
    // Check if order exists
    const existingOrder = await OrderDetails.findById(order_id);
    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const success = await OrderDetails.delete(order_id);
    if (success) {
      res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete order' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get orders by user email
exports.getOrdersByEmail = async (req, res) => {
  try {
    const { email_address } = req.params;
    
    if (!email_address) {
      return res.status(400).json({ message: 'Email address is required' });
    }
    
    const orders = await OrderDetails.findByEmail(email_address);
    res.status(200).json({ message: 'Orders retrieved successfully', orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get orders by date range
exports.getOrdersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }
    
    const orders = await OrderDetails.findByDateRange(startDate, endDate);
    res.status(200).json({ message: 'Orders retrieved successfully', orders });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
