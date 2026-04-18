const pool = require('../config/db');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const isCustomer = req.user.role === 'customer';
        const userId = req.user.id;

        // 1. Order Status Counts
        let statusQuery = 'SELECT status, COUNT(*) as count FROM orders';
        let statusParams = [];
        if (isCustomer) {
            statusQuery += ' WHERE customer_id = ?';
            statusParams.push(userId);
        }
        statusQuery += ' GROUP BY status';
        const [statusRows] = await pool.query(statusQuery, statusParams);

        const stats = { total: 0, pending: 0, assigned: 0, shipped: 0, delivered: 0, cancelled: 0 };
        statusRows.forEach(row => {
            const status = row.status.toLowerCase();
            stats[status] = row.count;
            stats.total += row.count;
        });

        // 2. Weekly Stats (Last 7 Days)
        let weeklyQuery = `
            SELECT DATE(created_at) as date, COUNT(*) as count 
            FROM orders 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        `;
        if (isCustomer) weeklyQuery += ' AND customer_id = ' + pool.escape(userId);
        weeklyQuery += ' GROUP BY DATE(created_at) ORDER BY date ASC';
        const [weeklyRows] = await pool.query(weeklyQuery);

        // 3. Today's Orders
        let todayQuery = 'SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()';
        if (isCustomer) todayQuery += ' AND customer_id = ' + pool.escape(userId);
        const [todayRows] = await pool.query(todayQuery);

        // 4. Top Vehicles (System-wide or filtered by user's assigned orders)
        let topVehiclesQuery = `
            SELECT v.type, COUNT(r.id) as count 
            FROM vehicles v 
            JOIN routes r ON v.id = r.vehicle_id 
            GROUP BY v.id ORDER BY count DESC LIMIT 5
        `;
        const [topVehicleRows] = await pool.query(topVehiclesQuery);

        // 5. Recent Activity (Last 5 orders)
        let recentQuery = `
            SELECT o.id, o.status, o.created_at, u.name as customer_name
            FROM orders o
            JOIN users u ON o.customer_id = u.id
        `;
        if (isCustomer) recentQuery += ' WHERE o.customer_id = ' + pool.escape(userId);
        recentQuery += ' ORDER BY o.created_at DESC LIMIT 5';
        const [recentRows] = await pool.query(recentQuery);

        res.json({
            success: true,
            data: {
                stats,
                weeklyStats: weeklyRows,
                todayCount: todayRows[0]?.count || 0,
                topVehicles: topVehicleRows,
                recentActivity: recentRows
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching dashboard stats' });
    }
};

module.exports = {
    getDashboardStats
};
