const pool = require('../config/db');

const testConnection = async (req, res) => {
    try {
        // Simple query to test the connection
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        res.status(200).json({
            success: true,
            message: 'Database connected successfully',
            data: rows
        });
    } catch (error) {
        console.error('Database connection error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
};

module.exports = {
    testConnection
};
