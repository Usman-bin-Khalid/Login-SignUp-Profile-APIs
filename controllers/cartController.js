const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');

// 1. Add to Cart
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // From authMiddleware

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            // Check if product already exists in cart
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
            cart = await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create new cart for user
            const newCart = await Cart.create({
                userId,
                items: [{ productId, quantity }]
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error });
    }
};

// 2. Checkout (The Complex Logic)
exports.checkout = async (req, res) => {
    const userId = req.user.id;

    try {
        // 1. Fetch Cart and populate product details
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let total = 0;
        const orderItems = [];

        // 2. Verify Stock and Calculate Total
        for (let item of cart.items) {
            const product = item.productId;

            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            total += product.price * item.quantity;
            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });

            // 3. Subtract from Stock
            product.stockQuantity -= item.quantity;
            await product.save();
        }

        // 4. Create Order
        const order = await Order.create({
            userId,
            items: orderItems,
            totalPrice: total,
            status: 'Pending'
        });

        // 5. Empty the Cart
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ message: "Order placed successfully", order });

    } catch (error) {
        res.status(500).json({ message: "Checkout failed", error: error.message });
    }
};