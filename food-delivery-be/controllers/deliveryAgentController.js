const DeliveryAgent = require('../models/deliveryAgent');

// Get all delivery agents
exports.getAllDeliveryAgents = async (req, res) => {
    try {
        const agents = await DeliveryAgent.findAll();
        res.status(200).json({ message: 'Delivery agents retrieved successfully', agents });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get delivery agent by ID
exports.getDeliveryAgentById = async (req, res) => {
    try {
        const { agent_id } = req.params;
        const agent = await DeliveryAgent.findById(agent_id);
        
        if (!agent) {
            return res.status(404).json({ message: 'Delivery agent not found' });
        }
        
        res.status(200).json({ message: 'Delivery agent retrieved successfully', agent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get delivery agent by email address
exports.getDeliveryAgentByEmail = async (req, res) => {
    try {
        const { email_address } = req.params;
        const agent = await DeliveryAgent.findByEmail(email_address);
        
        if (!agent) {
            return res.status(404).json({ message: 'Delivery agent not found' });
        }
        
        res.status(200).json({ message: 'Delivery agent retrieved successfully', agent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get delivery agent by phone
exports.getDeliveryAgentByPhone = async (req, res) => {
    try {
        const { phone_number } = req.params;
        const agent = await DeliveryAgent.findByPhone(phone_number);
        
        if (!agent) {
            return res.status(404).json({ message: 'Delivery agent not found' });
        }
        
        res.status(200).json({ message: 'Delivery agent retrieved successfully', agent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get available delivery agents
exports.getAvailableDeliveryAgents = async (req, res) => {
    try {
        const agents = await DeliveryAgent.findAvailable();
        res.status(200).json({ message: 'Available delivery agents retrieved successfully', agents });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new delivery agent
exports.createDeliveryAgent = async (req, res) => {
    try {
        const { phone_number, email_address, number_of_trips, is_free, SSN } = req.body;
        
        // Validate required fields
        if (!phone_number || !email_address || !SSN) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Check if phone already exists
        const existingPhone = await DeliveryAgent.findByPhone(phone_number);
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already in use' });
        }
        
        // Check if email already exists
        const existingEmail = await DeliveryAgent.findByEmail(email_address);
        if (existingEmail) {
            return res.status(400).json({ message: 'Email address already in use' });
        }
        
        const agentId = await DeliveryAgent.create({
            phone_number,
            email_address,
            number_of_trips: number_of_trips || 0,
            is_free: is_free !== undefined ? is_free : true,
            SSN
        });
        
        const newAgent = await DeliveryAgent.findById(agentId);
        res.status(201).json({ message: 'Delivery agent created successfully', agent: newAgent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update a delivery agent
exports.updateDeliveryAgent = async (req, res) => {
    try {
        const { agent_id } = req.params;
        const updates = req.body;
        
        // Check if agent exists
        const existingAgent = await DeliveryAgent.findById(agent_id);
        if (!existingAgent) {
            return res.status(404).json({ message: 'Delivery agent not found' });
        }
        
        // Check if phone is being updated and if it already exists
        if (updates.phone_number && updates.phone_number !== existingAgent.phone_number) {
            const existingPhone = await DeliveryAgent.findByPhone(updates.phone_number);
            if (existingPhone) {
                return res.status(400).json({ message: 'Phone number already in use' });
            }
        }
        
        // Check if email is being updated and if it already exists
        if (updates.email_address && updates.email_address !== existingAgent.email_address) {
            const existingEmail = await DeliveryAgent.findByEmail(updates.email_address);
            if (existingEmail) {
                return res.status(400).json({ message: 'Email address already in use' });
            }
        }
        
        const success = await DeliveryAgent.update(agent_id, updates);
        if (success) {
            const updatedAgent = await DeliveryAgent.findById(agent_id);
            res.status(200).json({ message: 'Delivery agent updated successfully', agent: updatedAgent });
        } else {
            res.status(400).json({ message: 'Failed to update delivery agent' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update delivery agent availability
exports.updateDeliveryAgentStatus = async (req, res) => {
    try {
        const { agent_id } = req.params;
        const { is_free } = req.body;
        
        // Check if agent exists
        const existingAgent = await DeliveryAgent.findById(agent_id);
        if (!existingAgent) {
            return res.status(404).json({ message: 'Delivery agent not found' });
        }
        
        // Validate is_free
        if (is_free === undefined) {
            return res.status(400).json({ message: 'is_free status is required' });
        }
        
        const success = await DeliveryAgent.updateStatus(agent_id, is_free);
        if (success) {
            const updatedAgent = await DeliveryAgent.findById(agent_id);
            res.status(200).json({ message: 'Delivery agent availability updated successfully', agent: updatedAgent });
        } else {
            res.status(400).json({ message: 'Failed to update delivery agent availability' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete a delivery agent
exports.deleteDeliveryAgent = async (req, res) => {
    try {
        const { agent_id } = req.params;
        
        // Check if agent exists
        const existingAgent = await DeliveryAgent.findById(agent_id);
        if (!existingAgent) {
            return res.status(404).json({ message: 'Delivery agent not found' });
        }
        
        const success = await DeliveryAgent.delete(agent_id);
        if (success) {
            res.status(200).json({ message: 'Delivery agent deleted successfully' });
        } else {
            res.status(400).json({ message: 'Failed to delete delivery agent' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get delivery agent with orders
exports.getDeliveryAgentWithOrders = async (req, res) => {
    try {
        const { agent_id } = req.params;
        
        // Check if agent exists
        const existingAgent = await DeliveryAgent.findById(agent_id);
        if (!existingAgent) {
            return res.status(404).json({ message: 'Delivery agent not found' });
        }
        
        const agentWithOrders = await DeliveryAgent.getAgentWithOrders(agent_id);
        res.status(200).json({ message: 'Delivery agent with orders retrieved successfully', agentWithOrders });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get delivery agent stats
exports.getDeliveryAgentStats = async (req, res) => {
    try {
        const { agent_id } = req.params;
        
        // Check if agent exists
        const existingAgent = await DeliveryAgent.findById(agent_id);
        if (!existingAgent) {
            return res.status(404).json({ message: 'Delivery agent not found' });
        }
        
        const stats = await DeliveryAgent.getAgentStats(agent_id);
        res.status(200).json({ message: 'Delivery agent stats retrieved successfully', stats });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
