const crypto = require('crypto');
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

        /*
         * Find the order belonging to the authenticated user.
         */
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

        /*
         * Prevent payment for cancelled orders.
         */
        if (order.status === 'cancelled') {
            await client.query('ROLLBACK');

            return res.status(400).json({
                message: 'Cancelled orders cannot be paid'
            });
        }

        /*
         * Check whether this order has already been successfully paid.
         */
        const existingPayment = await client.query(
            `SELECT *
             FROM payments
             WHERE order_id = $1
             AND status = 'successful'
             LIMIT 1`,
            [order.id]
        );

        if (existingPayment.rows.length > 0) {
            await client.query('ROLLBACK');

            return res.status(400).json({
                message: 'Order has already been paid',
                payment: existingPayment.rows[0]
            });
        }

        /*
         * Generate a unique test transaction reference.
         */
        const transactionReference =
            `TEST-${crypto.randomUUID()}`;

        /*
         * This is currently a mock/test payment.
         *
         * Later this section can be replaced with
         * Paystack, Flutterwave, or another provider.
         */
        const paymentResult = await client.query(
            `INSERT INTO payments
             (
                order_id,
                user_id,
                amount,
                status,
                payment_method,
                transaction_reference
             )
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

        /*
         * Successful payment moves the order
         * from pending to processing.
         */
        await client.query(
            `UPDATE orders
             SET status = 'processing'
             WHERE id = $1`,
            [order.id]
        );

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Payment successful',
            payment: paymentResult.rows[0],
            order: {
                id: order.id,
                status: 'processing',
                totalAmount: order.total_amount
            }
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
            `SELECT
                p.id,
                p.order_id,
                p.amount,
                p.status,
                p.payment_method,
                p.transaction_reference,
                p.created_at
             FROM payments p
             WHERE p.user_id = $1
             ORDER BY p.created_at DESC`,
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
