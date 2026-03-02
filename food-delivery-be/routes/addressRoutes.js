const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
 
router.post('/createAddress', addressController.createAddress);
router.post('/updateAddress', addressController.updateAddress);
router.get('/getAddress', addressController.getAddressesByEmail);
router.delete('/deleteAddress', addressController.deleteAddress);
router.get('/rowCount', addressController.getRowCount);
router.post('/setPrimaryAddress', addressController.setPrimaryAddress);
router.get('/getAllAddresses', addressController.getAllAddresses);
 
module.exports = router;