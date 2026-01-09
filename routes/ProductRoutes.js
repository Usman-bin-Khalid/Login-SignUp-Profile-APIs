const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { 
    createProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

// Public route to see products
router.get('/', getAllProducts);

// Protected/Admin routes (You can add an admin check middleware later)
router.post('/add', upload.single('image'), createProduct);
router.put('/update/:id', upload.single('image'), updateProduct);
router.delete('/delete/:id', deleteProduct);

module.exports = router;