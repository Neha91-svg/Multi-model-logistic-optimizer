const pool = require('../config/db');

// Helper to log status history
const logStatusHistory = async (connection, orderId, status) => {
    await connection.query(
        'INSERT INTO order_status_history (order_id, status) VALUES (?, ?)',
        [orderId, status]
    );
};

// Helper to find and assign a vehicle to an order
const autoAssignVehicle = async (connection, orderId, weight) => {
    const [vehicles] = await connection.query(
        'SELECT * FROM vehicles WHERE capacity >= ? LIMIT 1',
        [weight]
    );

    if (vehicles.length > 0) {
        const vehicle = vehicles[0];
        const dummyDistance = (Math.random() * (100 - 10) + 10).toFixed(2);
        const dummyTimeHours = Math.floor(dummyDistance / 40) + 1;
        const dummyTime = `${dummyTimeHours} hour(s) ${Math.floor(Math.random() * 60)} mins`;

        await connection.query(
            'INSERT INTO routes (order_id, vehicle_id, distance, time) VALUES (?, ?, ?, ?)',
            [orderId, vehicle.id, dummyDistance, dummyTime]
        );

        const status = 'assigned';
        await connection.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, orderId]
        );
        
        await logStatusHistory(connection, orderId, status);

        return {
            vehicle_id: vehicle.id,
            vehicle_type: vehicle.type,
            distance: dummyDistance,
            time: dummyTime,
            status
        };
    }
    return null;
};

// @desc    Create new order
const createOrder = async (req, res) => {
    const { pickup, delivery, weight } = req.body;
    if (!pickup || !delivery || !weight) {
        return res.status(400).json({ success: false, message: 'Please provide pickup, delivery and weight' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            'INSERT INTO orders (customer_id, pickup, delivery, weight, status) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, pickup, delivery, weight, 'pending']
        );
        const orderId = orderResult.insertId;

        // Log initial pending status
        await logStatusHistory(connection, orderId, 'pending');

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
                assignment: assignmentInfo || 'No suitable vehicle found. Order is pending.'
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

// @desc    Manually trigger auto-assignment
const assignOrder = async (req, res) => {
    const orderId = req.params.id;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [orders] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (orders.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const order = orders[0];
        if (order.status !== 'pending') {
            await connection.rollback();
            return res.status(400).json({ success: false, message: `Order is already ${order.status}` });
        }

        const assignmentInfo = await autoAssignVehicle(connection, orderId, order.weight);
        if (!assignmentInfo) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'No suitable vehicle available' });
        }

        await connection.commit();
        res.json({ success: true, message: 'Vehicle assigned successfully', data: assignmentInfo });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during assignment' });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Get all orders
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

// @desc    Get single order by ID with history
const getOrder = async (req, res) => {
    const orderId = req.params.id;
    console.log(`[DEBUG] Attempting to fetch mission intel for ID: ${orderId} by User: ${req.user.id}`);
    try {
        // Fetch order details
        let orderQuery = `
            SELECT o.*, u.name as customer_name, r.distance, r.time, v.type as vehicle_type, 
                   v.driver_id, d.name as driver_name
            FROM orders o 
            JOIN users u ON o.customer_id = u.id 
            LEFT JOIN routes r ON o.id = r.order_id 
            LEFT JOIN vehicles v ON r.vehicle_id = v.id
            LEFT JOIN users d ON v.driver_id = d.id
            WHERE o.id = ?
        `;
        const [orders] = await pool.query(orderQuery, [orderId]);

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'Mission protocol not found' });
        }

        const order = orders[0];
        
        // Authorization check
        if (req.user.role === 'customer' && order.customer_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized access to mission data' });
        }

        // Fetch status history
        const [history] = await pool.query(
            'SELECT status, created_at FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC',
            [orderId]
        );

        res.json({ 
            success: true, 
            data: { 
                ...order, 
                history 
            } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching mission details' });
    }
};

// @desc    Update order status
const updateOrder = async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;
    const validStatuses = ['pending', 'assigned', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [existing] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (existing.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const newStatus = status || existing[0].status;
        await connection.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderId]);
        
        // Log history change
        await logStatusHistory(connection, orderId, newStatus);

        await connection.commit();
        res.json({ success: true, message: 'Mission status updated', data: { id: orderId, status: newStatus } });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while updating order' });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Delete order
const deleteOrder = async (req, res) => {
    const orderId = req.params.id;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [existing] = await connection.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (existing.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        if (req.user.role === 'customer' && existing[0].customer_id !== req.user.id) {
            await connection.rollback();
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        await connection.query('DELETE FROM routes WHERE order_id = ?', [orderId]);
        await connection.query('DELETE FROM orders WHERE id = ?', [orderId]);

        await connection.commit();
        res.json({ success: true, message: 'Order deleted' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error during deletion' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    createOrder,
    assignOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
};
