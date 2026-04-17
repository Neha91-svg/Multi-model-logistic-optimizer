const pool = require('../config/db');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        let orderQuery = 'SELECT status, COUNT(*) as count FROM orders';
        let params = [];

        // If customer, only show stats for their orders
        if (req.user.role === 'customer') {
            orderQuery += ' WHERE customer_id = ?';
            params.push(req.user.id);
        }

        orderQuery += ' GROUP BY status';

        const [rows] = await pool.query(orderQuery, params);

        // Format the results
        const stats = {
            total: 0,
            pending: 0,
            assigned: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };

        rows.forEach(row => {
            const status = row.status.toLowerCase();
            stats[status] = row.count;
            stats.total += row.count;
        });

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching dashboard stats' });
    }
};

module.exports = {
    getDashboardStats
};
