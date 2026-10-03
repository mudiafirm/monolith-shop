const pool = require('../db/database');

async function getAllCustomers(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                u.id,
                u.name,
                u.email,
                u.role,
                u.created_at,
                COUNT(o.id)::int AS order_count,
                COALESCE(
                    SUM(
                        CASE
                            WHEN o.status != 'cancelled'
                            THEN o.total_amount
                            ELSE 0
                        END
                    ),
                    0
                )::numeric AS total_spent
            FROM users u
            LEFT JOIN orders o
                ON o.user_id = u.id
            WHERE u.role = 'customer'
            GROUP BY
                u.id,
                u.name,
                u.email,
                u.role,
                u.created_at
            ORDER BY u.created_at DESC
        `);

        res.json({
            customers: result.rows
        });

    } catch (error) {
        console.error('Get customers error:', error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

async function getCustomerById(req, res) {
    try {
        const { id } = req.params;

        const customerResult = await pool.query(`
            SELECT
                u.id,
                u.name,
                u.email,
                u.role,
                u.created_at,
                COUNT(o.id)::int AS order_count,
                COALESCE(
                    SUM(
                        CASE
                            WHEN o.status != 'cancelled'
                            THEN o.total_amount
                            ELSE 0
                        END
                    ),
                    0
                )::numeric AS total_spent
            FROM users u
            LEFT JOIN orders o
                ON o.user_id = u.id
            WHERE u.id = $1
              AND u.role = 'customer'
            GROUP BY
                u.id,
                u.name,
                u.email,
                u.role,
                u.created_at
        `, [id]);

        if (customerResult.rows.length === 0) {
            return res.status(404).json({
                message: 'Customer not found'
            });
        }

        const ordersResult = await pool.query(`
            SELECT
                id,
                status,
                total_amount,
                created_at
            FROM orders
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [id]);

        res.json({
            customer: customerResult.rows[0],
            orders: ordersResult.rows
        });

    } catch (error) {
        console.error('Get customer error:', error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = {
    getAllCustomers,
    getCustomerById
};
