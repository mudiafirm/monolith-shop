const express = require('express');

const router = express.Router();

const {
    makePayment,
    getPayments
} = require('../controllers/paymentController');

const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, makePayment);

router.get('/', authenticateToken, getPayments);

module.exports = router;
