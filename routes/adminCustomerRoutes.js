const express = require('express');

const router = express.Router();

const {
    getAllCustomers,
    getCustomerById
} = require('../controllers/adminCustomerController');

const requireAdmin = require('../middleware/adminMiddleware');

router.use(requireAdmin);

router.get('/', getAllCustomers);

router.get('/:id', getCustomerById);

module.exports = router;
