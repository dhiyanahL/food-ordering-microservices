const express = require('express');
const router = express.Router();

const {
    createOrder,
    viewOrder,
    processRefund,
    getAllOrders,
    getOrderHistory,
    updateOrderStatus,
} = require('../controllers/orderController');

router.get('/history', getOrderHistory);
router.get('/orders', getAllOrders);
router.post('/create', createOrder);
router.get('/:id', viewOrder);
router.put('/:id/refund', processRefund);
//router.get('/orders', getAllOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
