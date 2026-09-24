const express = require('express');

const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const authenticateToken = require('../middleware/authMiddleware');


const {
    validateProduct
} = require('../middleware/validation');

router.get('/', getProducts);

router.get('/:id', getProductById);

router.post(
    '/',
    authenticateToken,
    validateProduct,
    createProduct
);

router.put(
    '/:id',
    authenticateToken,
    validateProduct,
    updateProduct
);

router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;
