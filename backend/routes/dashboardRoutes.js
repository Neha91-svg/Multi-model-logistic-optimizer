const express = require('express');
const router = express.Router();
const { getDashboardStats, getActivities } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);
router.get('/activities', protect, getActivities);

module.exports = router;
