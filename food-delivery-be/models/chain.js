const db = require('../config/database');

const Chain = {
  // Create a new chain
  async create({ name, address, phone_number, operating_hours }) {
    const [result] = await db.query(
      'INSERT INTO chain (name, address, phone_number, operating_hours) VALUES (?, ?, ?, ?)',
      [name, address, phone_number, operating_hours]
    );
    return {
      chain_id: result.insertId,
      name,
      address,
      phone_number,
      operating_hours
    };
  },

  // Find chain by ID
  async findById(chain_id) {
    const [rows] = await db.query('SELECT * FROM chain WHERE chain_id = ?', [chain_id]);
    return rows[0];
  },

  async findChain() {
    const [rows] = await db.query('SELECT * FROM chain');
    return rows;
  },

  // Update a chain
  async update(chain_id, updates) {
    const [result] = await db.query(
      'UPDATE chain SET ? WHERE chain_id = ?',
      [updates, chain_id]
    );
    return result.affectedRows > 0;
  },

  // Delete a chain
  async delete(chain_id) {
    const [result] = await db.query('DELETE FROM chain WHERE chain_id = ?', [chain_id]);
    return result.affectedRows > 0;
  }
};

module.exports = Chain;
