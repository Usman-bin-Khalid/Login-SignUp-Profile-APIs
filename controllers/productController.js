const Product = require('../models/Product');

// 1. ADD PRODUCT
exports.addProduct = async (req, res) => {
    try {
        const { name, price, stockQuantity, category } = req.body;
        
        // req.file.path comes from the Cloudinary/Multer middleware
        const imageUrl = req.file ? req.file.path : ""; 

        const newProduct = new Product({
            name,
            price: Number(price), // Ensure it's a number
            stockQuantity: Number(stockQuantity),
            category,
            image: imageUrl
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
};

// 2. GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};

// 3. UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    try {
        const updates = req.body;
        if (req.file) {
            updates.image = req.file.path; // Update image if new one is uploaded
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            updates, 
            { new: true }
        );

        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Update failed", error });
    }
};

// 4. DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error });
    }
};