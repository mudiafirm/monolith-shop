const express = require('express');

const router = express.Router();

const {
    getDashboardSummary
} = require('../controllers/adminDashboardController');

const requireAdmin = require('../middleware/adminMiddleware');

router.use(requireAdmin);

router.get('/', getDashboardSummary);

module.exports = router;
