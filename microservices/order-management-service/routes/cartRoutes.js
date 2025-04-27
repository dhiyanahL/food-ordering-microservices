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

router.post('/cart/add', addToCart);
router.put('/cart/update', updateItemQuantity);
router.delete('/cart/remove', removeItemFromCart);
router.get('/cart', viewCart);
router.post('/cart/checkout', checkoutCart);
router.delete('/cart/clear', clearCart);

module.exports = router;