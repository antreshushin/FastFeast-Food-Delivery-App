const PaymentMethod = require('../models/paymentMethod');
 
// Create new payment method
exports.createPaymentMethod = async (req, res) => {
  try {
    const { method, card_number, expiry_date, cvv, zip_code, is_primary, email_address } = req.body;
 
    const paymentMethod = await PaymentMethod.create({
      method,
      card_number,
      expiry_date,
      cvv,
      zip_code,
      is_primary,
      email_address
    });
 
    res.status(200).json({ message: 'Payment method created', paymentMethod });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Get payment method by email
exports.getPaymentMethodByEmail = async (req, res) => {
  try {
    const { email_address } = req.query;
    
    const paymentMethod = await PaymentMethod.findByEmail(email_address);
    if (!paymentMethod) {
      return res.status(404).json({ message: 'No payment method found for this email' });
    }
 
    res.status(200).json({ paymentMethod });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Update payment method
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { email_address } = req.body;
    const updates = req.body;
 
    const success = await PaymentMethod.update(email_address, updates);
    if (!success) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
 
    res.status(200).json({ message: 'Payment method updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Delete payment method
exports.deletePaymentMethod = async (req, res) => {
  try {
    const { card_number } = req.query;
 
    const success = await PaymentMethod.delete(card_number);
    if (!success) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
 
    res.status(200).json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Get all payment methods
exports.getAllPayments = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.findAll();
    res.status(200).json({
      message: 'Payment methods retrieved successfully',
      paymentMethods
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Set primary payment method
exports.setPrimaryCard = async (req, res) => {
  try {
    const { oldCardNumber, newCardNumber } = req.query;
    
    // Validate required fields
    if (!newCardNumber) {
      return res.status(400).json({ message: 'New primary card number is required' });
    }
    
    // Set primary card
    await PaymentMethod.setPrimaryCard(oldCardNumber, newCardNumber);
    
    res.status(200).json({
      message: 'Primary payment method set successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};