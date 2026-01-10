const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addToCart, checkout, getCart } = require('../controllers/cartController');

// All cart routes should be protected
router.get('/', auth, getCart);

// All cart routes should be protected
router.post('/add', auth, addToCart);
router.post('/checkout', auth, checkout);

module.exports = router;