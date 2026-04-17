const express = require('express');
const router = express.Router();
const { createVehicle, getVehicles, assignDriver } = require('../controllers/vehicleController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', admin, createVehicle);
router.get('/', getVehicles);
router.post('/assign', admin, assignDriver);

module.exports = router;
