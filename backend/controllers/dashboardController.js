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

        // 2. Weekly Stats (Last 7 Days) with status breakdown
        let weeklyQuery = `
            SELECT DATE(created_at) as date, status, COUNT(*) as count 
            FROM orders 
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        `;
        if (isCustomer) weeklyQuery += ' AND customer_id = ' + pool.escape(userId);
        weeklyQuery += ' GROUP BY DATE(created_at), status ORDER BY date ASC';
        const [weeklyRows] = await pool.query(weeklyQuery);

        // Process weeklyRows into a chart-friendly format
        const weeklyDataMap = {};
        weeklyRows.forEach(row => {
            const dateStr = new Date(row.date).toLocaleDateString('en-US', { weekday: 'short' });
            if (!weeklyDataMap[dateStr]) {
                weeklyDataMap[dateStr] = { 
                    day: dateStr, 
                    date: row.date,
                    count: 0, // total count for Dashboard compatibility
                    pending: 0, 
                    assigned: 0, 
                    shipped: 0, 
                    delivered: 0, 
                    cancelled: 0 
                };
            }
            const status = row.status.toLowerCase();
            weeklyDataMap[dateStr][status] = row.count;
            weeklyDataMap[dateStr].count += row.count;
        });
        const processedWeeklyStats = Object.values(weeklyDataMap);

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

        // Calculate usage percentages for frontend
        const totalVehicleUsage = topVehicleRows.reduce((sum, v) => sum + v.count, 0);
        const processedTopVehicles = topVehicleRows.map(v => ({
            type: v.type,
            usage: totalVehicleUsage > 0 ? Math.round((v.count / totalVehicleUsage) * 100) : 0
        }));

        // 5. Recent Activity (Last 5 orders)
        let recentQuery = `
            SELECT o.id, o.status, o.created_at, u.name as customer_name
            FROM orders o
            JOIN users u ON o.customer_id = u.id
        `;
        if (isCustomer) recentQuery += ' WHERE o.customer_id = ' + pool.escape(userId);
        recentQuery += ' ORDER BY o.created_at DESC LIMIT 5';
        const [recentRows] = await pool.query(recentQuery);

        // Format recent activity for frontend
        const processedRecentActivity = recentRows.map(row => ({
            type: 'order',
            message: `Order #${row.id.toString().padStart(4, '0')} status updated to ${row.status}`,
            time: new Date(row.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            status: row.status
        }));

        res.json({
            success: true,
            data: {
                stats,
                weeklyStats: processedWeeklyStats,
                todayCount: todayRows[0]?.count || 0,
                topVehicles: processedTopVehicles,
                recentActivity: processedRecentActivity
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
