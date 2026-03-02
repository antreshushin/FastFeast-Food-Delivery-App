const db = require('../config/database');
 
const Address = {
  // Create a new address
  async create({ street_address1, street_address2, city_name, state_name, zip_code, email_address }) {
    const [result] = await db.query(
      'INSERT INTO address (street_address1, street_address2, city_name, state_name, zip_code, email_address) VALUES (?, ?, ?, ?, ?, ?)',
      [street_address1, street_address2, city_name, state_name, zip_code, email_address]
    );
    return {
      address_id: result.insertId,
      street_address1,
      street_address2,
      city_name,
      state_name,
      zip_code,
      email_address
    };
  },
 
  // Find address by email
  async findByEmail(email_address) {
    const [rows] = await db.query('SELECT * FROM food_delivery.address WHERE email_address = ?', [email_address]);
    return rows; // Returns all addresses for an email (could have multiple).
  },
 
  async rowCount() {
    const rowCount = await db.query('SELECT COUNT(*) FROM food_delivery.address');
    return rowCount;
  },
 
  // Update an address
  async update(address_id, fieldName, value) {
    // Construct the updates object for the SET clause
    const updates = { [fieldName]: value };
    const [result] = await db.query(
      'UPDATE address SET ? WHERE address_id = ?',
      [updates, address_id]
    );
    return result.affectedRows > 0;
  },
 
  // Delete an address
  async delete(address_id) {
    const [result] = await db.query('DELETE FROM address WHERE address_id = ?', [address_id]);
    return result.affectedRows > 0;
  },
 
  // Set primary address
  async setPrimaryAddress(oldPrimaryId, newPrimaryId) {
    try {
      // Start a transaction
      await db.query('START TRANSACTION');
      
      // Set the old primary address to non-primary
      if (oldPrimaryId) {
        await db.query(
          'UPDATE address SET is_primary = false WHERE address_id = ?',
          [oldPrimaryId]
        );
      }
      
      // Set the new primary address to primary
      await db.query(
        'UPDATE address SET is_primary = true WHERE address_id = ?',
        [newPrimaryId]
      );
      
      // Commit the transaction
      await db.query('COMMIT');
      
      return true;
    } catch (error) {
      // Rollback in case of error
      await db.query('ROLLBACK');
      throw error;
    }
  },
 
  // Find address by ID
  async findById(address_id) {
    const [rows] = await db.query('SELECT * FROM address WHERE address_id = ?', [address_id]);
    return rows[0];
  },
 
  // Find all addresses
  async findAll() {
    const [rows] = await db.query('SELECT * FROM address ORDER BY address_id');
    return rows;
  }
};
 
module.exports = Address;