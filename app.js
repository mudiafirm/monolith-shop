const express = require('express');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

// User routes
app.use('/api/users', userRoutes);

// Product routes
app.use('/api/products', productRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Payment routes
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Monolith Shop API is running'
    });
});

// Central error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Only start the server when app.js is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Monolith Shop API running on port ${PORT}`);
    });
}

// Export app for automated testing
module.exports = app;
