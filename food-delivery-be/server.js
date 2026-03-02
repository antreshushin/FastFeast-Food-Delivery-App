const express = require('express');
const db = require('./config/database');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const addressRoutes = require('./routes/addressRoutes');
const chainRoutes = require('./routes/chainRoutes');
const paymentMethodRoutes = require('./routes/paymentMethodRoutes');
const menuItemsRoutes = require('./routes/menuItemsRoutes');
const orderDetailsRoutes = require('./routes/orderDetailsRoutes');
const orderItemsRoutes = require('./routes/orderItemsRoutes');
const deliveryAgentRoutes = require('./routes/deliveryAgentRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const initDatabase = require('./models/init');

require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Middleware for cors
// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true
}));

// Routes
app.use('/auth', authRoutes);
app.use('/address', addressRoutes)
app.use('/chain', chainRoutes)
app.use('/payment', paymentMethodRoutes)
app.use('/menuItems', menuItemsRoutes)
app.use('/orderDetails', orderDetailsRoutes)
app.use('/orderItems', orderItemsRoutes)
app.use('/deliveryAgent', deliveryAgentRoutes)
app.use('/delivery', deliveryRoutes)

// Initialize database and start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await db.query('SELECT 1');
    console.log('Database connected');

    // Initialize all database tables
    await initDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
}

startServer();