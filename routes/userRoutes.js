const express = require('express');

const router = express.Router();

const {
    registerUser,
    loginUser
} = require('../controllers/userController');

const authenticateToken = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'You have access to your profile',
        user: req.user
    });
});

router.get('/admin-test', requireAdmin, (req, res) => {
    res.json({
        message: 'Admin authorization successful',
        user: req.user
    });
});

module.exports = router;
