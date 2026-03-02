const express = require('express');
const router = express.Router();
const menuItemsController = require('../controllers/menuItemsController');

// Basic CRUD routes
router.get('/', menuItemsController.getAllMenuItems);
router.get('/:item_id', menuItemsController.getMenuItemById);
router.post('/createMenuItem', menuItemsController.createMenuItem);
router.put('/:item_id', menuItemsController.updateMenuItem);
router.delete('/:item_id', menuItemsController.deleteMenuItem);

// Additional functionality routes
router.get('/price-range', menuItemsController.getMenuItemsByPriceRange);
router.get('/search', menuItemsController.searchMenuItems);

module.exports = router;
