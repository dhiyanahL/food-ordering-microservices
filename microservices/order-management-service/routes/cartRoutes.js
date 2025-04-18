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

// const verifyToken = require('../middleware/authMiddleware');

// router.post('/cart/add', verifyToken, addToCart);
// router.put('/cart/update', verifyToken, updateItemQuantity);
// router.delete('/cart/remove', verifyToken, removeItemFromCart);
// router.get('/cart', verifyToken, viewCart);
// router.post('/cart/checkout', verifyToken, checkoutCart);
// router.delete('/cart/clear', verifyToken, clearCart);

// Directly handle the cart without token (skip JWT)
router.post('/cart/add', addToCart);
router.put('/cart/update', updateItemQuantity);
router.delete('/cart/remove', removeItemFromCart);
router.get('/cart', viewCart);
router.post('/cart/checkout', checkoutCart);
router.delete('/cart/clear', clearCart);


module.exports = router;