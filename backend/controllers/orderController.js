const pool = require('../config/db');

// Helper to find and assign a vehicle to an order
const autoAssignVehicle = async (connection, orderId, weight) => {
    // Find a vehicle with enough capacity
    // For simplicity, we pick the first one available with enough capacity
    const [vehicles] = await connection.query(
        'SELECT * FROM vehicles WHERE capacity >= ? LIMIT 1',
        [weight]
    );

    if (vehicles.length > 0) {
        const vehicle = vehicles[0];

        // Generate dummy distance and time
        const dummyDistance = (Math.random() * (100 - 10) + 10).toFixed(2); // 10 to 100 km
        const dummyTimeHours = Math.floor(dummyDistance / 40) + 1; // Approx 40km/h + 1hr buffer
        const dummyTime = `${dummyTimeHours} hour(s) ${Math.floor(Math.random() * 60)} mins`;

        // Store the route
        await connection.query(
            'INSERT INTO routes (order_id, vehicle_id, distance, time) VALUES (?, ?, ?, ?)',
            [orderId, vehicle.id, dummyDistance, dummyTime]
        );

        // Update order status to assigned
        await connection.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            ['assigned', orderId]
        );

        return {
            vehicle_id: vehicle.id,
            vehicle_type: vehicle.type,
            distance: dummyDistance,
            time: dummyTime,
            status: 'assigned'
        };
    }
    return null;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    const { pickup, delivery, weight } = req.body;

    if (!pickup || !delivery || !weight) {
        return res.status(400).json({ success: false, message: 'Please provide pickup, delivery and weight' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Create the order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (customer_id, pickup, delivery, weight, status) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, pickup, delivery, weight, 'pending']
        );
        const orderId = orderResult.insertId;

        // 2. Attempt auto-assignment
        const assignmentInfo = await autoAssignVehicle(connection, orderId, weight);

        await connection.commit();

        res.status(201).json({
            success: true,
            data: {
                id: orderId,
                pickup,
                delivery,
                weight,
                status: assignmentInfo ? 'assigned' : 'pending',
                assignment: assignmentInfo || 'No suitable vehicle found at the moment. Order is pending.'
            }
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while creating order' });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Manually trigger auto-assignment for a pending order
// @route   POST /api/orders/:id/assign
// @access  Private
const assignOrder = async (req, res) => {
    const orderId = req.params.id;
    let connection;

    try {
        connection = await pool.getConnection();
        const [orders] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        
        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const order = orders[0];
        if (order.status !== 'pending') {
            return res.status(400).json({ success: false, message: `Order is already ${order.status}` });
        }

        const assignmentInfo = await autoAssignVehicle(connection, orderId, order.weight);

        if (!assignmentInfo) {
            return res.status(400).json({ success: false, message: 'No suitable vehicle available for this order' });
        }

        res.json({ success: true, message: 'Vehicle assigned successfully', data: assignmentInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during assignment' });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        let query = `
            SELECT o.*, u.name as customer_name, r.distance, r.time, v.type as vehicle_type 
            FROM orders o 
            JOIN users u ON o.customer_id = u.id 
            LEFT JOIN routes r ON o.id = r.order_id 
            LEFT JOIN vehicles v ON r.vehicle_id = v.id
        `;
        let params = [];

        if (req.user.role === 'customer') {
            query += ' WHERE o.customer_id = ?';
            params.push(req.user.id);
        }

        query += ' ORDER BY o.created_at DESC';

        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching orders' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    const validStatuses = ['pending', 'assigned', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    try {
        const [existing] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Logic for following the flow: Pending -> Assigned -> Shipped -> Delivered
        // (Just a warning for now, allowing arbitrary updates if needed but encouraging the flow in the UI)

        await pool.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status || existing[0].status, orderId]
        );

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: { id: orderId, status: status || existing[0].status }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while updating order' });
    }
};

module.exports = {
    createOrder,
    assignOrder,
    getOrders,
    updateOrder
};
