const MenuItems = require('../models/menuItems');

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItems.findAll();
    res.status(200).json({ message: 'Menu items retrieved successfully', menuItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const { item_id } = req.params;
    const menuItem = await MenuItems.findById(item_id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.status(200).json({ message: 'Menu item retrieved successfully', menuItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { item_name, description, price } = req.body;
    
    // Validate required fields
    if (!item_name || !description || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Validate price is a positive number
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    
    const newMenuItem = await MenuItems.create({ item_name, description, price });
    res.status(201).json({ message: 'Menu item created successfully', menuItem: newMenuItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    const updates = req.body;
    
    // Check if menu item exists
    const existingItem = await MenuItems.findById(item_id);
    if (!existingItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Validate price if it's being updated
    if (updates.price !== undefined) {
      if (isNaN(updates.price) || updates.price <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
      }
    }
    
    const success = await MenuItems.update(item_id, updates);
    if (success) {
      const updatedItem = await MenuItems.findById(item_id);
      res.status(200).json({ message: 'Menu item updated successfully', menuItem: updatedItem });
    } else {
      res.status(400).json({ message: 'Failed to update menu item' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    
    // Check if menu item exists
    const existingItem = await MenuItems.findById(item_id);
    if (!existingItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    const success = await MenuItems.delete(item_id);
    if (success) {
      res.status(200).json({ message: 'Menu item deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete menu item' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get menu items by price range
exports.getMenuItemsByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.query;
    
    // Validate price range
    if (!minPrice || !maxPrice || isNaN(minPrice) || isNaN(maxPrice) || minPrice > maxPrice) {
      return res.status(400).json({ message: 'Invalid price range' });
    }
    
    const menuItems = await MenuItems.findByPriceRange(parseFloat(minPrice), parseFloat(maxPrice));
    res.status(200).json({ message: 'Menu items retrieved successfully', menuItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search menu items
exports.searchMenuItems = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const menuItems = await MenuItems.search(query);
    res.status(200).json({ message: 'Menu items retrieved successfully', menuItems });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
