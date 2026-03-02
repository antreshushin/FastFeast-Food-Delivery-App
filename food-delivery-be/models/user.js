const db = require('../config/database');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = {
  // Find user by email
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return rows[0]; // Return first row or undefined if not found
  },

  // Create a new user
  async create({name, email, password }) {
    const [result] = await db.query(
      'INSERT INTO user (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return { id: result.insertId, name, email };
  },

  // Sign in user and generate JWT token
  async signIn(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real application, you should hash the password and compare with stored hash
    // For now, we'll do a simple comparison
    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  },

  // Verify JWT token
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};

module.exports = User;