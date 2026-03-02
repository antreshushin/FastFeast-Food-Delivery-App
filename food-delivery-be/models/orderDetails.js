const db = require('../config/database');

const OrderDetails = {
  // Create a new order
  async create({ email_address, address_id, card_number, total_price }) {
    const [result] = await db.query(
      'INSERT INTO order_details (email_address, address_id, card_number, total_price) VALUES (?, ?, ?, ?)',
      [email_address, address_id, card_number, total_price]
    );
    return {
      email_address,
      address_id,
      card_number,
      total_price
    };
  },

  // Find order by ID
  async findById(order_id) {
    const [rows] = await db.query('SELECT * FROM order_details WHERE order_id = ?', [order_id]);
    return rows[0];
  },

  // Find all orders
  async findAll() {
    const [rows] = await db.query('SELECT * FROM order_details');
    return rows;
  },

  // Find orders by user email
  async findByEmail(email_address) {
    const [rows] = await db.query('SELECT * FROM order_details WHERE email_address = ?', [email_address]);
    return rows;
  },

  // Update an order
  async update(order_id, updates) {
    const [result] = await db.query(
      'UPDATE order_details SET ? WHERE order_id = ?',
      [updates, order_id]
    );
    return result.affectedRows > 0;
  },

  // Delete an order
  async delete(order_id) {
    const [result] = await db.query('DELETE FROM order_details WHERE order_id = ?', [order_id]);
    return result.affectedRows > 0;
  },

  // Get order with related data (joins with users, address, and payment_method)
  async getOrderWithDetails(order_id) {
    const [rows] = await db.query(`
      SELECT 
        od.*, 
        u.name as user_name,
        a.street_address1, a.street_address2, a.city_name, a.state_name, a.zip_code,
        pm.method as payment_method
      FROM order_details od
      JOIN users u ON od.email_address = u.email
      JOIN address a ON od.address_id = a.address_id
      JOIN payment_method pm ON od.card_number = pm.card_number
      WHERE od.order_id = ?
    `, [order_id]);
    return rows[0];
  },

  // Get orders by date range
  async findByDateRange(startDate, endDate) {
    const [rows] = await db.query(
      'SELECT * FROM order_details WHERE created_at BETWEEN ? AND ?',
      [startDate, endDate]
    );
    return rows;
  }
};

module.exports = OrderDetails;
