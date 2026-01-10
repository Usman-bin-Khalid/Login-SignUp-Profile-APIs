const express = require('express');
const router = express.Router();

// FIX: Add curly braces around upload
const { upload } = require('../config/cloudinary'); 
const productController = require('../controllers/productController');

// Now 'upload' will not be undefined, and 'single' will work
router.post('/add', upload.single('image'), productController.addProduct);
router.get('/all', productController.getAllProducts);
router.delete('/delete/:id', productController.deleteProduct);
router.put('/update/:id', upload.single('image'), productController.updateProduct);

module.exports = router;