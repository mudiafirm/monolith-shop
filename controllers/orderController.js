const pool = require('../db/database');

async function createOrder(req, res) {
    const client = await pool.connect();

    try {
        const userId = req.user.userId;
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Order must contain at least one item'
            });
        }

        await client.query('BEGIN');

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const { productId, quantity } = item;

            if (!productId || !quantity || quantity <= 0) {
                throw new Error('Invalid product or quantity');
            }

            const productResult = await client.query(
                'SELECT * FROM products WHERE id = $1 FOR UPDATE',
                [productId]
            );

            if (productResult.rows.length === 0) {
                throw new Error(`Product ${productId} not found`);
            }

            const product = productResult.rows[0];

            if (product.stock < quantity) {
                throw new Error(
                    `Not enough stock for ${product.name}`
                );
            }

            const unitPrice = Number(product.price);
            const subtotal = unitPrice * quantity;

            totalAmount += subtotal;

            orderItems.push({
                productId,
                quantity,
                unitPrice,
                subtotal
            });

            await client.query(
                `UPDATE products
                 SET stock = stock - $1
                 WHERE id = $2`,
                [quantity, productId]
            );
        }

        const orderResult = await client.query(
            `INSERT INTO orders (user_id, status, total_amount)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [userId, 'pending', totalAmount]
        );

        const order = orderResult.rows[0];

        for (const item of orderItems) {
            await client.query(
                `INSERT INTO order_items
                 (order_id, product_id, quantity, unit_price, subtotal)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    order.id,
                    item.productId,
                    item.quantity,
                    item.unitPrice,
                    item.subtotal
                ]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                id: order.id,
                userId: order.user_id,
                status: order.status,
                totalAmount: order.total_amount,
                items: orderItems
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');

        console.error('Create order error:', error);

        res.status(400).json({
            message: error.message
        });

    } finally {
        client.release();
    }
}


async function getUserOrders(req, res) {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT
                o.id,
                o.status,
                o.total_amount,
                o.created_at
             FROM orders o
             WHERE o.user_id = $1
             ORDER BY o.created_at DESC`,
            [userId]
        );

        res.json({
            orders: result.rows
        });

    } catch (error) {
        console.error('Get orders error:', error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}


module.exports = {
    createOrder,
    getUserOrders
};
