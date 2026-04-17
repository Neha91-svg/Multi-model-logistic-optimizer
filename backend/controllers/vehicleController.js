const pool = require('../config/db');

// @desc    Create new vehicle
// @route   POST /api/vehicles
// @access  Private/Admin
const createVehicle = async (req, res) => {
    const { type, capacity, driver_id } = req.body;

    if (!type || !capacity) {
        return res.status(400).json({ success: false, message: 'Please provide type and capacity' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO vehicles (type, capacity, driver_id) VALUES (?, ?, ?)',
            [type, capacity, driver_id || null]
        );

        res.status(201).json({
            success: true,
            id: result.insertId,
            type,
            capacity,
            driver_id: driver_id || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while creating vehicle' });
    }
};

// @desc    Get all vehicles
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res) => {
    try {
        const query = `
            SELECT v.*, u.name as driver_name 
            FROM vehicles v 
            LEFT JOIN users u ON v.driver_id = u.id
        `;
        const [rows] = await pool.query(query);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching vehicles' });
    }
};

// @desc    Assign driver to vehicle
// @route   POST /api/vehicles/assign
// @access  Private/Admin
const assignDriver = async (req, res) => {
    const { vehicle_id, driver_id } = req.body;

    if (!vehicle_id || !driver_id) {
        return res.status(400).json({ success: false, message: 'Please provide vehicle_id and driver_id' });
    }

    try {
        // Check if vehicle exists
        const [vehicle] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [vehicle_id]);
        if (vehicle.length === 0) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }

        // Check if driver (user) exists and is a driver
        const [driver] = await pool.query('SELECT * FROM users WHERE id = ? AND role = "driver"', [driver_id]);
        if (driver.length === 0) {
            return res.status(404).json({ success: false, message: 'Driver not found or user is not a driver' });
        }

        await pool.query('UPDATE vehicles SET driver_id = ? WHERE id = ?', [driver_id, vehicle_id]);

        res.json({
            success: true,
            message: 'Driver assigned to vehicle successfully',
            data: { vehicle_id, driver_id }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while assigning driver' });
    }
};

module.exports = {
    createVehicle,
    getVehicles,
    assignDriver
};
