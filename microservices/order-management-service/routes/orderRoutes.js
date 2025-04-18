const express = require('express');
const router = express.Router();

const {
    createOrder,
    viewOrder,
    processRefund,
    getOrderHistory
} = require('../controllers/orderController');

const verifyToken = require('../middleware/authMiddleware');

router.post('/create', verifyToken, createOrder);
router.get('/:id', verifyToken, viewOrder);
router.put('/:id/refund', verifyToken, processRefund);
router.get('/history/all', verifyToken, getOrderHistory);

module.exports = router;