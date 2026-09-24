const express = require('express');

const router = express.Router();

const {
    registerUser,
    loginUser
} = require('../controllers/userController');

const authenticateToken = require('../middleware/authMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: 'You have access to your profile',
        user: req.user
    });
});

module.exports = router;
