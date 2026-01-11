const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true,   default: 0 },
    category: { type: String, required: true,   default: "General" },
    image: { type: String, default: "" } // Cloudinary URL
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

