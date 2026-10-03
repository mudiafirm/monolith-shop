const express = require('express');
const router = express.Router();

const {
    getAllOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');

const requireAdmin = require('../middleware/adminMiddleware');

router.use(requireAdmin);

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
