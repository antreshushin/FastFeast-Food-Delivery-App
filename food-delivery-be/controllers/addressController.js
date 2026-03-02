const Address = require('../models/address');
 
// Create new address
exports.createAddress = async (req, res) => {
  try {
    const { street_address1, street_address2, city_name, state_name, zip_code, email_address, isPrimary } = req.body;
 
    const address = await Address.create({
      street_address1,
      street_address2,
      city_name,
      state_name,
      zip_code,
      email_address,
      isPrimary
    });
 
    res.status(201).json({ message: 'Address created', address });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Get addresses by email
exports.getAddressesByEmail = async (req, res) => {
  try {
    const { email_address } = req.query;
    console.log(req.query);
    
    
    const addresses = await Address.findByEmail(email_address);
    if (!addresses.length) {
      return res.status(404).json({ message: 'No addresses found for this email' });
    }
 
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { address_id } = req.params;
    const fieldName = req.body.fieldName;
    const value = req.body.value;
 
    const success = await Address.update(address_id, fieldName, value);
    if (!success) {
      return res.status(404).json({ message: 'Address not found' });
    }
 
    res.status(200).json({ message: 'Address updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { address_id } = req.query;
 
    const success = await Address.delete(address_id);
    if (!success) {
      return res.status(404).json({ message: 'Address not found' });
    }
 
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
exports.getRowCount = async (req, res) => {
  try {
    const rowCount = await Address.rowCount();
    res.status(200).json({ rowCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.findAll();
    res.status(200).json({ message: 'Addresses retrieved successfully', addresses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Get address by ID
exports.getAddressById = async (req, res) => {
  try {
    const { address_id } = req.params;
    const address = await Address.findById(address_id);
    
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }
    
    res.status(200).json({ message: 'Address retrieved successfully', address });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
 
// Set primary address
exports.setPrimaryAddress = async (req, res) => {
  try {
    const { oldPrimaryId, newPrimaryId } = req.query;
    
    console.log(oldPrimaryId, newPrimaryId);
    // Validate required fields
    if (!newPrimaryId) {
      return res.status(400).json({ message: 'New primary address ID is required' });
    }
 
    
    // Check if new primary address exists
    const newPrimaryAddress = await Address.findById(newPrimaryId);
    if (!newPrimaryAddress) {
      return res.status(404).json({ message: 'New primary address not found' });
    }
    
    // If old primary ID is provided, check if it exists
    if (oldPrimaryId) {
      const oldPrimaryAddress = await Address.findById(oldPrimaryId);
      if (!oldPrimaryAddress) {
        return res.status(404).json({ message: 'Old primary address not found' });
      }
    }
    
    // Set primary address
    await Address.setPrimaryAddress(oldPrimaryId, newPrimaryId);
    
    // Get the updated addresses
    const updatedNewPrimary = await Address.findById(newPrimaryId);
    let updatedOldPrimary = null;
    
    if (oldPrimaryId) {
      updatedOldPrimary = await Address.findById(oldPrimaryId);
    }
    
    res.status(200).json({
      message: 'Primary address set successfully',
      newPrimary: updatedNewPrimary,
      oldPrimary: updatedOldPrimary
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};