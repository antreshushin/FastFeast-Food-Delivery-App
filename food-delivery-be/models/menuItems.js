const db = require('../config/database');

const MenuItems = {
  // Create a new menu item
  async create({ item_name, description, price }) {
    const [result] = await db.query(
      'INSERT INTO menu_items (item_name, description, price) VALUES (?, ?, ?)',
      [item_name, description, price]
    );
    return {
      item_name,
      description,
      price
    };
  },

  // Find menu item by ID
  async findById(item_id) {
    const [rows] = await db.query('SELECT * FROM menu_items WHERE item_id = ?', [item_id]);
    return rows[0];
  },

  // Find all menu items
  async findAll() {
    const [rows] = await db.query('SELECT * FROM menu_items');
    return rows;
  },

  // Update a menu item
  async update(item_id, updates) {
    const [result] = await db.query(
      'UPDATE menu_items SET ? WHERE item_id = ?',
      [updates, item_id]
    );
    return result.affectedRows > 0;
  },

  // Delete a menu item
  async delete(item_id) {
    const [result] = await db.query('DELETE FROM menu_items WHERE item_id = ?', [item_id]);
    return result.affectedRows > 0;
  },

  // Find menu items by price range
  async findByPriceRange(minPrice, maxPrice) {
    const [rows] = await db.query(
      'SELECT * FROM menu_items WHERE price BETWEEN ? AND ?',
      [minPrice, maxPrice]
    );
    return rows;
  },

  // Search menu items by name or description
  async search(query) {
    const searchTerm = `%${query}%`;
    const [rows] = await db.query(
      'SELECT * FROM menu_items WHERE item_name LIKE ? OR description LIKE ?',
      [searchTerm, searchTerm]
    );
    return rows;
  }
};

module.exports = MenuItems;
