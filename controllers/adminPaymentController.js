const pool = require('../db/database');


async function getAllPayments(req, res) {
    try {
        const result = await pool.query(
            `SELECT
                p.id,
                p.order_id,
                p.user_id,
                u.name AS customer_name,
                u.email AS customer_email,
                p.amount,
                p.status,
                p.payment_method,
                p.transaction_reference,
                p.created_at
             FROM payments p
             JOIN users u
               ON u.id = p.user_id
             ORDER BY p.created_at DESC`
        );

        res.json({
            payments: result.rows
        });

    } catch (error) {
        console.error('Get all payments error:', error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}


async function getPaymentById(req, res) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                p.id,
                p.order_id,
                p.user_id,
                u.name AS customer_name,
                u.email AS customer_email,
                p.amount,
                p.status,
                p.payment_method,
                p.transaction_reference,
                p.created_at
             FROM payments p
             JOIN users u
               ON u.id = p.user_id
             WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Payment not found'
            });
        }

        res.json({
            payment: result.rows[0]
        });

    } catch (error) {
        console.error('Get payment error:', error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}


module.exports = {
    getAllPayments,
    getPaymentById
};
