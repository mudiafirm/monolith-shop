const pool = require('../db/database');

async function makePayment(req, res) {
    const client = await pool.connect();

    try {
        const userId = req.user.userId;
        const { orderId, paymentMethod } = req.body;

        if (!orderId || !paymentMethod) {
            return res.status(400).json({
                message: 'Order ID and payment method are required'
            });
        }

        await client.query('BEGIN');

        const orderResult = await client.query(
            `SELECT *
             FROM orders
             WHERE id = $1
             AND user_id = $2
             FOR UPDATE`,
            [orderId, userId]
        );

        if (orderResult.rows.length === 0) {
            await client.query('ROLLBACK');

            return res.status(404).json({
                message: 'Order not found'
            });
        }

        const order = orderResult.rows[0];

        if (order.status === 'paid') {
            await client.query('ROLLBACK');

            return res.status(400).json({
                message: 'Order has already been paid'
            });
        }

        const transactionReference =
            `TXN-${Date.now()}-${order.id}`;

        const paymentResult = await client.query(
            `INSERT INTO payments
             (order_id, user_id, amount, status,
              payment_method, transaction_reference)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [
                order.id,
                userId,
                order.total_amount,
                'successful',
                paymentMethod,
                transactionReference
            ]
        );

        await client.query(
            `UPDATE orders
             SET status = 'paid'
             WHERE id = $1`,
            [order.id]
        );

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Payment successful',
            payment: paymentResult.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');

        console.error('Payment error:', error);

        res.status(500).json({
            message: 'Payment failed'
        });

    } finally {
        client.release();
    }
}


async function getPayments(req, res) {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT *
             FROM payments
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        res.json({
            payments: result.rows
        });

    } catch (error) {
        console.error('Get payments error:', error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}


module.exports = {
    makePayment,
    getPayments
};
