const pool = require('../config/db');

// @desc    Create new order and automatically assign vehicle/route
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

        // 2. Find a vehicle with enough capacity
        // For simplicity, we pick the first one available with enough capacity
        const [vehicles] = await connection.query(
            'SELECT * FROM vehicles WHERE capacity >= ? LIMIT 1',
            [weight]
        );

        let assignmentInfo = null;

        if (vehicles.length > 0) {
            const vehicle = vehicles[0];

            // 3. Generate dummy distance and time
            const dummyDistance = (Math.random() * (100 - 10) + 10).toFixed(2); // 10 to 100 km
            const dummyTimeHours = Math.floor(dummyDistance / 40) + 1; // Approx 40km/h + 1hr buffer
            const dummyTime = `${dummyTimeHours} hour(s) ${Math.floor(Math.random() * 60)} mins`;

            // 4. Store the route
            await connection.query(
                'INSERT INTO routes (order_id, vehicle_id, distance, time) VALUES (?, ?, ?, ?)',
                [orderId, vehicle.id, dummyDistance, dummyTime]
            );

            // 5. Update order status to assigned
            await connection.query(
                'UPDATE orders SET status = ? WHERE id = ?',
                ['assigned', orderId]
            );

            assignmentInfo = {
                vehicle_id: vehicle.id,
                vehicle_type: vehicle.type,
                distance: dummyDistance,
                time: dummyTime,
                status: 'assigned'
            };
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            data: {
                id: orderId,
                pickup,
                delivery,
                weight,
                status: assignmentInfo ? 'assigned' : 'pending',
                assignment: assignmentInfo || 'No suitable vehicle found at the moment'
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

        const [rows] = await pool.query(query, params);
        res.json({ success: true, count: rows.length, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while fetching orders' });
    }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res) => {
    const { pickup, delivery, weight, status } = req.body;
    const orderId = req.params.id;

    try {
        const [existing] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (req.user.role === 'customer' && existing[0].customer_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
        }

        const updatedPickup = pickup || existing[0].pickup;
        const updatedDelivery = delivery || existing[0].delivery;
        const updatedWeight = weight || existing[0].weight;
        const updatedStatus = status || existing[0].status;

        await pool.query(
            'UPDATE orders SET pickup = ?, delivery = ?, weight = ?, status = ? WHERE id = ?',
            [updatedPickup, updatedDelivery, updatedWeight, updatedStatus, orderId]
        );

        res.json({
            success: true,
            message: 'Order updated successfully',
            data: { id: orderId, pickup: updatedPickup, delivery: updatedDelivery, weight: updatedWeight, status: updatedStatus }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error while updating order' });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrder
};
