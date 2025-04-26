const express = require('express');
const router = express.Router();
const {
    viewCart,
    addToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    checkoutCart
}  = require('../controllers/cartController');

const verifyToken = require('../middleware/authMiddleware');

router.post('/cart/add', verifyToken, addToCart);
router.put('/cart/update', verifyToken, updateItemQuantity);
router.delete('/cart/remove', verifyToken, removeItemFromCart);
router.get('/cart', verifyToken, viewCart);
router.post('/cart/checkout', verifyToken, checkoutCart);
router.delete('/cart/clear', verifyToken, clearCart);

module.exports = router;