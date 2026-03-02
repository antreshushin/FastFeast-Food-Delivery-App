const express = require('express');
const router = express.Router();
const chainController = require('../controllers/chainController');

router.post('/createChain', chainController.createChain);
router.post('/updateChain', chainController.updateChain);
router.get('/getChain/:id', chainController.getChainById);
router.get('/getChain', chainController.getChain);
router.delete('/deleteChain', chainController.deleteChain);


module.exports = router;
