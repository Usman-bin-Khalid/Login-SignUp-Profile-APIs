require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const socialRoutes = require('./routes/socialRoutes'); // 1. Import new routes
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Root route to check if API is working
app.get('/', (req, res) => {
    res.send('Login, Sign Up & Profile APIs are running! Use /api/products/all to see products.');
});

// 2. Register routes
app.use('/api/auth', authRoutes);
app.use('/api/social', socialRoutes); // 3. Mount social routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
