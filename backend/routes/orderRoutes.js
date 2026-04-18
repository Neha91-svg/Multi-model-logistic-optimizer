const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrder, assignOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.post('/:id/assign', assignOrder);
router.get('/', getOrders);
router.put('/:id', updateOrder);

module.exports = router;
