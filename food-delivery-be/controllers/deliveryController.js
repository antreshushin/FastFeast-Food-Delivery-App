const Delivery = require('../models/delivery');
const DeliveryAgent = require('../models/deliveryAgent');
const OrderDetails = require('../models/orderDetails');

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.findAll();
        res.status(200).json({ message: 'Deliveries retrieved successfully', deliveries });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get delivery by order ID
exports.getDeliveryByOrderId = async (req, res) => {
    try {
        const { order_id } = req.params;
        const delivery = await Delivery.findByOrderId(order_id);
        
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        
        res.status(200).json({ message: 'Delivery retrieved successfully', delivery });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get deliveries by agent ID
exports.getDeliveriesByAgentId = async (req, res) => {
    try {
        const { agent_id } = req.params;
        const deliveries = await Delivery.findByAgentId(agent_id);
        
        res.status(200).json({ message: 'Deliveries retrieved successfully', deliveries });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get deliveries by status
exports.getDeliveriesByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const deliveries = await Delivery.findByStatus(status);
        
        res.status(200).json({ message: 'Deliveries retrieved successfully', deliveries });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new delivery
exports.createDelivery = async (req, res) => {
    try {
        const { order_id, agent_id, ETA, status } = req.body;
        
        // Validate required fields
        if (!order_id || !agent_id || !ETA || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Check if order exists
        const order = await OrderDetails.findById(order_id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Check if agent exists
        const agent = await DeliveryAgent.findById(agent_id);
        if (!agent) {
            return res.status(404).json({ message: 'Delivery agent not found' });
        }
        
        // Check if agent is available
        if (!agent.is_free) {
            return res.status(400).json({ message: 'Delivery agent is not available' });
        }
        
        // Check if delivery already exists for this order
        const existingDelivery = await Delivery.findByOrderId(order_id);
        if (existingDelivery) {
            return res.status(400).json({ message: 'Delivery already exists for this order' });
        }
        
        // Validate status
        const validStatuses = ['preparing', 'cooking', 'waiting for pickup', 'on the way', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        // Create delivery
        const deliveryId = await Delivery.create({
            order_id,
            agent_id,
            ETA,
            status
        });
        
        // Update agent status to not free
        await DeliveryAgent.updateStatus(agent_id, false);
        
        // Get the created delivery
        const newDelivery = await Delivery.findByOrderId(order_id);
        
        res.status(201).json({ message: 'Delivery created successfully', delivery: newDelivery });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a delivery
exports.updateDelivery = async (req, res) => {
    try {
        const { order_id } = req.params;
        const updates = req.body;
        
        // Check if delivery exists
        const existingDelivery = await Delivery.findByOrderId(order_id);
        if (!existingDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        
        // If agent is being updated, check if new agent exists and is available
        if (updates.agent_id && updates.agent_id !== existingDelivery.agent_id) {
            const newAgent = await DeliveryAgent.findById(updates.agent_id);
            if (!newAgent) {
                return res.status(404).json({ message: 'New delivery agent not found' });
            }
            
            if (!newAgent.is_free) {
                return res.status(400).json({ message: 'New delivery agent is not available' });
            }
            
            // Update old agent status to free
            await DeliveryAgent.updateStatus(existingDelivery.agent_id, true);
            
            // Update new agent status to not free
            await DeliveryAgent.updateStatus(updates.agent_id, false);
        }
        
        // Validate status if it's being updated
        if (updates.status) {
            const validStatuses = ['preparing', 'cooking', 'waiting for pickup', 'on the way', 'delivered'];
            if (!validStatuses.includes(updates.status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }
        }
        
        const success = await Delivery.update(order_id, updates);
        if (success) {
            const updatedDelivery = await Delivery.findByOrderId(order_id);
            res.status(200).json({ message: 'Delivery updated successfully', delivery: updatedDelivery });
        } else {
            res.status(400).json({ message: 'Failed to update delivery' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { order_id } = req.params;
        const { status } = req.body;
        
        // Check if delivery exists
        const existingDelivery = await Delivery.findByOrderId(order_id);
        if (!existingDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        
        // Validate status
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        
        const validStatuses = ['preparing', 'cooking', 'waiting for pickup', 'on the way', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        // If status is being changed to 'delivered', update agent status to free
        if (status === 'delivered' && existingDelivery.status !== 'delivered') {
            await DeliveryAgent.updateStatus(existingDelivery.agent_id, true);
        }
        
        const success = await Delivery.updateStatus(order_id, status);
        if (success) {
            const updatedDelivery = await Delivery.findByOrderId(order_id);
            res.status(200).json({ message: 'Delivery status updated successfully', delivery: updatedDelivery });
        } else {
            res.status(400).json({ message: 'Failed to update delivery status' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a delivery
exports.deleteDelivery = async (req, res) => {
    try {
        const { order_id } = req.params;
        
        // Check if delivery exists
        const existingDelivery = await Delivery.findByOrderId(order_id);
        if (!existingDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        
        // Update agent status to free
        await DeliveryAgent.updateStatus(existingDelivery.agent_id, true);
        
        const success = await Delivery.delete(order_id);
        if (success) {
            res.status(200).json({ message: 'Delivery deleted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to delete delivery' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get delivery with order details
exports.getDeliveryWithOrder = async (req, res) => {
    try {
        const { order_id } = req.params;
        
        // Check if delivery exists
        const existingDelivery = await Delivery.findByOrderId(order_id);
        if (!existingDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        
        const deliveryWithOrder = await Delivery.getDeliveryWithOrder(order_id);
        res.status(200).json({ message: 'Delivery with order details retrieved successfully', deliveryWithOrder });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get delivery with agent details
exports.getDeliveryWithAgent = async (req, res) => {
    try {
        const { order_id } = req.params;
        
        // Check if delivery exists
        const existingDelivery = await Delivery.findByOrderId(order_id);
        if (!existingDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        
        const deliveryWithAgent = await Delivery.getDeliveryWithAgent(order_id);
        res.status(200).json({ message: 'Delivery with agent details retrieved successfully', deliveryWithAgent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get delivery with full details
exports.getDeliveryWithFullDetails = async (req, res) => {
    try {
        const { order_id } = req.params;
        
        // Check if delivery exists
        const existingDelivery = await Delivery.findByOrderId(order_id);
        if (!existingDelivery) {
            return res.status(404).json({ message: 'Delivery not found' });
        }
        
        const deliveryWithFullDetails = await Delivery.getDeliveryWithFullDetails(order_id);
        res.status(200).json({ message: 'Delivery with full details retrieved successfully', deliveryWithFullDetails });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get deliveries by date range
exports.getDeliveriesByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }
        
        const deliveries = await Delivery.getDeliveriesByDateRange(startDate, endDate);
        res.status(200).json({ message: 'Deliveries retrieved successfully', deliveries });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 