const db = require('../config/database');
 
const PaymentMethod = {
  // Create a new payment method
  async create({ method, card_number, expiry_date, cvv, zip_code, is_primary, email_address }) {
    const [result] = await db.query(
      'INSERT INTO payment_method (method, card_number, expiry_date, cvv, zip_code, is_primary, email_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [method, card_number, expiry_date, cvv, zip_code, is_primary, email_address]
    );
    return {
      method,
      card_number,
      expiry_date,
      cvv,
      zip_code,
      is_primary,
      email_address
    };
  },
 
  // Find payment method by email
  async findByEmail(email_address) {
    const [rows] = await db.query('SELECT * FROM payment_method WHERE email_address = ?', [email_address]);
    return rows; // Returns single payment method since email is primary key
  },
 
  // Update a payment method
  async update(email_address, updates) {
    const [result] = await db.query(
      'UPDATE payment_method SET ? WHERE email_address = ?',
      [updates, email_address]
    );
    return result.affectedRows > 0;
  },
 
  // Delete a payment method
  async delete(card_number) {
    const [result] = await db.query('DELETE FROM payment_method WHERE card_number = ?', [card_number]);
    return result.affectedRows > 0;
  },
 
  // Find all payment methods
  async findAll() {
    const [rows] = await db.query('SELECT * FROM payment_method ORDER BY email_address, is_primary DESC');
    return rows;
  },
 
  // Set primary payment method
  async setPrimaryCard(oldCardNumber, newCardNumber) {
    try {
      // Start a transaction
      await db.query('START TRANSACTION');
      
      // Set the old primary card to non-primary
      if (oldCardNumber) {
        await db.query(
          'UPDATE payment_method SET is_primary = false WHERE card_number = ?',
          [oldCardNumber]
        );
      }
      
      // Set the new card to primary
      await db.query(
        'UPDATE payment_method SET is_primary = true WHERE card_number = ?',
        [newCardNumber]
      );
      
      // Commit the transaction
      await db.query('COMMIT');
      
      return true;
    } catch (error) {
      // Rollback in case of error
      await db.query('ROLLBACK');
      throw error;
    }
  }
};
 
module.exports = PaymentMethod;