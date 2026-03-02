const User = require('../models/user');
const bcrypt = require('bcrypt');

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User created', user: { id: user.id, name, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Signin
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Signin successful', user: { id: user.id, username: user.username, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  const {email} = req.query;

  const user = await User.findByEmail(email);
  
  res.status(200).json({message: user});
}