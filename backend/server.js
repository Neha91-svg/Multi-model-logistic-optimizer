const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/stats', dashboardRoutes);
app.use('/api/dashboard', dashboardRoutes); // backward compatibility

// Root route
app.get('/', (req, res) => {
    res.send('Multi-model Logistic Optimizer API is running...');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
