const express = require('express');
const router = express.Router();
const deliveryAgentController = require('../controllers/deliveryAgentController');

// Get all delivery agents
router.get('/', deliveryAgentController.getAllDeliveryAgents);

// Get available delivery agents
router.get('/available', deliveryAgentController.getAvailableDeliveryAgents);

// Get delivery agent by ID
router.get('/:agent_id', deliveryAgentController.getDeliveryAgentById);

// Get delivery agent by email address
router.get('/email/:email_address', deliveryAgentController.getDeliveryAgentByEmail);

// Get delivery agent by phone
router.get('/phone/:phone_number', deliveryAgentController.getDeliveryAgentByPhone);

// Get delivery agent with orders
router.get('/:agent_id/orders', deliveryAgentController.getDeliveryAgentWithOrders);

// Get delivery agent stats
router.get('/:agent_id/stats', deliveryAgentController.getDeliveryAgentStats);

// Create a new delivery agent
router.post('/', deliveryAgentController.createDeliveryAgent);

// Update a delivery agent
router.put('/:agent_id', deliveryAgentController.updateDeliveryAgent);

// Update delivery agent availability
router.patch('/:agent_id/availability', deliveryAgentController.updateDeliveryAgentStatus);

// Delete a delivery agent
router.delete('/:agent_id', deliveryAgentController.deleteDeliveryAgent);

module.exports = router;
