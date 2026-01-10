const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMyOrders, getOrderById } = require('../controllers/orderController');

// All order routes are protected
router.get('/my-orders', auth, getMyOrders);
router.get('/:id', auth, getOrderById);

module.exports = router;
