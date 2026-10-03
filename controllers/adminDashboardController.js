const pool = require('../db/database');

async function getDashboardSummary(req, res) {
    try {
        const [
            productsResult,
            ordersResult,
            pendingResult,
            processingResult,
            customersResult,
            revenueResult
        ] = await Promise.all([
            pool.query(`
                SELECT COUNT(*)::int AS count
                FROM products
            `),

            pool.query(`
                SELECT COUNT(*)::int AS count
                FROM orders
            `),

            pool.query(`
                SELECT COUNT(*)::int AS count
                FROM orders
                WHERE status = 'pending'
            `),

            pool.query(`
                SELECT COUNT(*)::int AS count
                FROM orders
                WHERE status = 'processing'
            `),

            pool.query(`
                SELECT COUNT(*)::int AS count
                FROM users
                WHERE role = 'customer'
            `),

            pool.query(`
                SELECT COALESCE(SUM(total_amount), 0)::numeric AS total
                FROM orders
                WHERE status != 'cancelled'
            `)
        ]);

        res.json({
            summary: {
                totalProducts: productsResult.rows[0].count,
                totalOrders: ordersResult.rows[0].count,
                pendingOrders: pendingResult.rows[0].count,
                processingOrders: processingResult.rows[0].count,
                totalCustomers: customersResult.rows[0].count,
                totalRevenue: revenueResult.rows[0].total
            }
        });

    } catch (error) {
        console.error('Get dashboard summary error:', error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

module.exports = {
    getDashboardSummary
};
