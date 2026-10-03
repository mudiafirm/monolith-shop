const express = require('express');

const router = express.Router();

const {
    getAllPayments,
    getPaymentById
} = require('../controllers/adminPaymentController');

const requireAdmin = require('../middleware/adminMiddleware');


router.use(requireAdmin);

router.get('/', getAllPayments);

router.get('/:id', getPaymentById);


module.exports = router;
