const express = require('express');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const adminCustomerRoutes = require('./routes/adminCustomerRoutes');
const adminPaymentRoutes = require('./routes/adminPaymentRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

// User routes
app.use('/api/users', userRoutes);

// Product routes
app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/admin/orders', adminOrderRoutes);
app.use('/api/admin/customers', adminCustomerRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/payments', adminPaymentRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Payment routes
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Monolith Shop API is running'
    });
});

// Kubernetes health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy'
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
