const express = require('express');
const router = express.Router();
const orderItemsController = require('../controllers/orderItemsController');

// Get all order items
router.get('/', orderItemsController.getAllOrderItems);

// Get order item by ID
router.get('/:order_item_id', orderItemsController.getOrderItemById);

// Get order items by order ID
router.get('/order/:order_id', orderItemsController.getOrderItemsByOrderId);

// Get order items with details
router.get('/order/:order_id/details', orderItemsController.getOrderItemsWithDetails);

// Get order total
router.get('/order/:order_id/total', orderItemsController.getOrderTotal);

// Create a new order item
router.post('/', orderItemsController.createOrderItem);

// Update an order item
router.put('/:order_id', orderItemsController.updateOrderItem);

// Delete an order item
router.delete('/:order_id/:item_id', orderItemsController.deleteOrderItem);

module.exports = router;
