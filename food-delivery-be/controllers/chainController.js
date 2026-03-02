const Chain = require('../models/chain');

// Create new chain
exports.createChain = async (req, res) => {
  try {
    const { name, address, phone_number, operating_hours } = req.body;
    
    const chain = await Chain.create({
      name,
      address, 
      phone_number,
      operating_hours
    });

    res.status(201).json({ chain });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get chain by ID
exports.getChainById = async (req, res) => {
  try {
    const { chain_id } = req.query;
    
    const chain = await Chain.findById(chain_id);
    if (!chain) {
      return res.status(404).json({ message: 'Chain not found' });
    }

    res.status(200).json({ chain });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all chain
exports.getChain = async (req, res) => {
  try {
    
    const chain = await Chain.findChain();
    if (!chain) {
      return res.status(404).json({ message: 'Chain not found' });
    }
 
    res.status(200).json({ chain });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update chain
exports.updateChain = async (req, res) => {
  try {
    const { chain_id } = req.body;
    const updates = req.body;

    const success = await Chain.update(chain_id, updates);
    if (!success) {
      return res.status(404).json({ message: 'Chain not found' });
    }

    res.status(200).json({ message: 'Chain updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete chain
exports.deleteChain = async (req, res) => {
  try {
    const { chain_id } = req.query;

    const success = await Chain.delete(chain_id);
    if (!success) {
      return res.status(404).json({ message: 'Chain not found' });
    }

    res.status(200).json({ message: 'Chain deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
