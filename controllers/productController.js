const Product = require('../models/Product');

// 1. Create Product (Admin logic)
exports.createProduct = async (req, res) => {
    try {
        const { name, price, stockQuantity, category } = req.body;
        const imageUrl = req.file ? req.file.path : ""; // Cloudinary URL from Multer

        const product = await Product.create({
            name,
            price,
            stockQuantity,
            category,
            image: imageUrl
        });

        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Failed to create product", error: error.message });
    }
};

// 2. Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};

// 3. Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // If a new image is uploaded, update the image field
        if (req.file) {
            updates.image = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        
        res.status(200).json({ message: "Product updated", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error });
    }
};

// 4. Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed", error });
    }
};