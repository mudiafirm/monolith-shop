const express = require('express');

const router = express.Router();

const {
    createOrder,
    getUserOrders
} = require('../controllers/orderController');

const authenticateToken = require('../middleware/authMiddleware');
const {
    validateOrder
} = require('../middleware/validation');

router.post(
    '/',
    authenticateToken,
    validateOrder,
    createOrder
);

router.get('/', authenticateToken, getUserOrders);

module.exports = router;
