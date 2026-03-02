const db = require('../config/database');

const initDatabase = async () => {
  try {
    console.log('Initializing database tables...');

    // Create user table first (other tables depend on it)
    try {
      const userQuery = `
        CREATE TABLE IF NOT EXISTS user (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;
      await db.query(userQuery);
      console.log('User table initialized');
    } catch (error) {
      console.error('Error creating user table:', error);
      throw error;
    }

    // Create chain table (independent table)
    try {
      const chainQuery = `
        CREATE TABLE IF NOT EXISTS chain (
          chain_id INT AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          address TEXT NOT NULL,
          phone_number VARCHAR(20),
          operating_hours VARCHAR(100),
          CONSTRAINT pk_chain PRIMARY KEY (chain_id)
        )
      `;
      await db.query(chainQuery);
      console.log('Chain table initialized');
    } catch (error) {
      console.error('Error creating chain table:', error);
      throw error;
    }

    // Create menu_items table (independent table)
    try {
      const menuItemsQuery = `
        CREATE TABLE IF NOT EXISTS menu_items (
          item_id INT NOT NULL AUTO_INCREMENT,           
          item_name VARCHAR(50) NOT NULL,
          description VARCHAR(512) NOT NULL,
          price FLOAT NOT NULL,
          CONSTRAINT pk_menu_item PRIMARY KEY (item_id)
        )
      `;
      await db.query(menuItemsQuery);
      console.log('Menu items table initialized');
    } catch (error) {
      console.error('Error creating menu_items table:', error);
      throw error;
    }

    // Create delivery_agent table (independent table)
    try {
      const deliveryAgentQuery = `
        CREATE TABLE IF NOT EXISTS delivery_agent (
          agent_id INT NOT NULL AUTO_INCREMENT,
          phone_number VARCHAR(10) NOT NULL,
          email_address VARCHAR(50) NOT NULL,
          number_of_trips INT NOT NULL,
          is_free BOOLEAN NOT NULL DEFAULT true,
          SSN VARCHAR(10) NOT NULL,
          CONSTRAINT pk_delivery_agent PRIMARY KEY (agent_id)
        )
      `;
      await db.query(deliveryAgentQuery);
      console.log('Delivery agent table initialized');
    } catch (error) {
      console.error('Error creating delivery_agent table:', error);
      throw error;
    }

    // Create address table (depends on user)
    try {
      const addressQuery = `
        CREATE TABLE IF NOT EXISTS address (
          address_id INT NOT NULL AUTO_INCREMENT,
          street_address1 VARCHAR(128) NOT NULL,
          street_address2 VARCHAR(128),
          city_name VARCHAR(50) NOT NULL, 
          state_name VARCHAR(50) NOT NULL,
          zip_code VARCHAR(5) NOT NULL,
          email_address VARCHAR(255) NOT NULL,
          is_primary BOOLEAN NOT NULL DEFAULT FALSE,
          CONSTRAINT pk_address PRIMARY KEY (address_id),
          CONSTRAINT fk_address FOREIGN KEY (email_address) REFERENCES user(email) ON DELETE CASCADE ON UPDATE CASCADE
        )
      `;
      await db.query(addressQuery);
      console.log('Address table initialized');
    } catch (error) {
      console.error('Error creating address table:', error);
      throw error;
    }

    // Create payment_method table (depends on user)
    try {
      const paymentMethodQuery = `
        CREATE TABLE IF NOT EXISTS payment_method (
          method ENUM('debit', 'credit') NOT NULL,
          card_number VARCHAR(16) NOT NULL PRIMARY KEY,
          expiry_date DATE NOT NULL,
          cvv INT NOT NULL,
          zip_code VARCHAR(5) NOT NULL,
          is_primary BOOLEAN NOT NULL DEFAULT FALSE,
          email_address VARCHAR(255) NOT NULL,
          CONSTRAINT fk_payment_method FOREIGN KEY (email_address) REFERENCES user(email) ON DELETE CASCADE ON UPDATE CASCADE
        )
      `;
      await db.query(paymentMethodQuery);
      console.log('Payment method table initialized');
    } catch (error) {
      console.error('Error creating payment_method table:', error);
      throw error;
    }

    // Create order_details table (depends on user, payment_method, and address)
    try {
      const orderDetailsQuery = `
        CREATE TABLE IF NOT EXISTS order_details (
          order_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
          email_address VARCHAR(255) NOT NULL,
          address_id INT NOT NULL, 
          card_number VARCHAR(16) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          CONSTRAINT fk_email_address FOREIGN KEY (email_address) REFERENCES user(email) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_payment_method_od FOREIGN KEY (card_number) REFERENCES payment_method(card_number) ON DELETE RESTRICT ON UPDATE CASCADE,
          CONSTRAINT fk_address_od FOREIGN KEY (address_id) REFERENCES address(address_id) ON DELETE CASCADE ON UPDATE CASCADE
        )
      `;
      await db.query(orderDetailsQuery);
      console.log('Order details table initialized');
    } catch (error) {
      console.error('Error creating order_details table:', error);
      throw error;
    }

    // Create order_items table (depends on order_details and menu_items)
    try {
      const orderItemsQuery = `
        CREATE TABLE IF NOT EXISTS order_items (
          order_id INT NOT NULL,
          item_id INT NOT NULL,
          qty INT NOT NULL,
          customer_preference VARCHAR(1028),
          CONSTRAINT fk_order_items FOREIGN KEY (order_id) REFERENCES order_details(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_menu_items FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT pk_order_items PRIMARY KEY (order_id, item_id)
        )
      `;
      await db.query(orderItemsQuery);
      console.log('Order items table initialized');
    } catch (error) {
      console.error('Error creating order_items table:', error);
      throw error;
    }

    // Create delivery table (depends on order_details and delivery_agent)
    try {
      const deliveryQuery = `
        CREATE TABLE IF NOT EXISTS delivery (
          order_id INT NOT NULL,
          agent_id INT NOT NULL,
          ETA DATETIME NOT NULL,
          status ENUM('preparing', 'cooking', 'waiting for pickup', 'on the way', 'delivered') NOT NULL,
          CONSTRAINT pk_delivery PRIMARY KEY (order_id),
          CONSTRAINT fk_delivery_order_id FOREIGN KEY (order_id) REFERENCES order_details(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT fk_delivery_agent_id FOREIGN KEY (agent_id) REFERENCES delivery_agent(agent_id) ON DELETE CASCADE ON UPDATE CASCADE
        )
      `;
      await db.query(deliveryQuery);
      console.log('Delivery table initialized');
    } catch (error) {
      console.error('Error creating delivery table:', error);
      throw error;
    }

    console.log('All tables initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = initDatabase; 