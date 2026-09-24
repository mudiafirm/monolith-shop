function validateProduct(req, res, next) {
    const { name, description, price, stock } = req.body;
    const errors = [];

    // Name
    if (
        typeof name !== 'string' ||
        !name.trim()
    ) {
        errors.push('Product name is required');
    }

    // Description
    if (
        typeof description !== 'string' ||
        !description.trim()
    ) {
        errors.push('Product description is required');
    }

    // Price
    const numericPrice = Number(price);

    if (
        price === undefined ||
        price === null ||
        price === '' ||
        !Number.isFinite(numericPrice) ||
        numericPrice <= 0
    ) {
        errors.push('Price must be greater than zero');
    }

    // Stock
    const numericStock = Number(stock);

    if (
        stock === undefined ||
        stock === null ||
        stock === '' ||
        !Number.isInteger(numericStock) ||
        numericStock < 0
    ) {
        errors.push('Stock must be a non-negative integer');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
}


function validateOrder(req, res, next) {
    const { items } = req.body;
    const errors = [];

    if (!Array.isArray(items) || items.length === 0) {
        errors.push('Order must contain at least one item');
    }

    if (Array.isArray(items)) {
        items.forEach((item, index) => {

            if (
                !item ||
                !Number.isInteger(Number(item.productId)) ||
                Number(item.productId) <= 0
            ) {
                errors.push(
                    `Item ${index + 1}: productId must be a positive integer`
                );
            }

            if (
                !item ||
                !Number.isInteger(Number(item.quantity)) ||
                Number(item.quantity) <= 0
            ) {
                errors.push(
                    `Item ${index + 1}: quantity must be a positive integer`
                );
            }
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
}


module.exports = {
    validateProduct,
    validateOrder
};
