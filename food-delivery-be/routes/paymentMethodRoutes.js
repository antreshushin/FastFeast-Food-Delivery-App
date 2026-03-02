const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');
 
router.post('/createPaymentMethod', paymentMethodController.createPaymentMethod);
router.post('/updatePaymentMethod', paymentMethodController.updatePaymentMethod);
router.get('/getPaymentMethod', paymentMethodController.getPaymentMethodByEmail);
router.delete('/deletePaymentMethod', paymentMethodController.deletePaymentMethod);
router.get('/getAllPayments', paymentMethodController.getAllPayments);
router.post('/setPrimaryCard', paymentMethodController.setPrimaryCard);
 
module.exports = router;