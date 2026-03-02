const express = require('express');
const router = express.Router();
const orderDetailsController = require('../controllers/orderDetailsController');

// Get all orders
router.get('/', orderDetailsController.getAllOrders);

// Get order by ID
router.get('/:order_id', orderDetailsController.getOrderById);

// Get order with full details
router.get('/:order_id/details', orderDetailsController.getOrderWithDetails);

// Create a new order
router.post('/', orderDetailsController.createOrder);

// Update an order
router.put('/:order_id', orderDetailsController.updateOrder);

// Delete an order
router.delete('/:order_id', orderDetailsController.deleteOrder);

// Get orders by user email
router.get('/user/:email_address', orderDetailsController.getOrdersByEmail);

// Get orders by date range
router.get('/date-range', orderDetailsController.getOrdersByDateRange);

module.exports = router; 