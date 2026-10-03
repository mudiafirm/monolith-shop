const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const requireAdmin = require('../middleware/adminMiddleware');

// All routes in this file require administrator authorization
router.use(requireAdmin);

// List all products
router.get('/', getProducts);

// Get one product
router.get('/:id', getProductById);

// Create product
router.post('/', createProduct);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

module.exports = router;
