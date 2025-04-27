const express = require('express');
const router = express.Router();

const {
    createOrder,
    viewOrder,
    processRefund,
    getOrderHistory
} = require('../controllers/orderController');


router.post('/create', createOrder);
router.get('/:id', viewOrder);
router.put('/:id/refund', processRefund);
router.get('/history/all', getOrderHistory);

module.exports = router;