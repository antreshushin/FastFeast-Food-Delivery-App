const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Get all deliveries
router.get('/', deliveryController.getAllDeliveries);

// Get deliveries by date range
router.get('/date-range', deliveryController.getDeliveriesByDateRange);

// Get deliveries by agent ID
router.get('/agent/:agent_id', deliveryController.getDeliveriesByAgentId);

// Get deliveries by status
router.get('/status/:status', deliveryController.getDeliveriesByStatus);

// Get delivery by order ID
router.get('/:order_id', deliveryController.getDeliveryByOrderId);

// Get delivery with order details
router.get('/:order_id/order', deliveryController.getDeliveryWithOrder);

// Get delivery with agent details
router.get('/:order_id/agent', deliveryController.getDeliveryWithAgent);

// Get delivery with full details
router.get('/:order_id/full', deliveryController.getDeliveryWithFullDetails);

// Create a new delivery
router.post('/', deliveryController.createDelivery);

// Update a delivery
router.put('/:order_id', deliveryController.updateDelivery);

// Update delivery status
router.patch('/:order_id/status', deliveryController.updateDeliveryStatus);

// Delete a delivery
router.delete('/:order_id', deliveryController.deleteDelivery);

module.exports = router;
