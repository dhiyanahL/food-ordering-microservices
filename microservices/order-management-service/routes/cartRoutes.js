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

router.post('/add', addToCart);
router.put('/update', updateItemQuantity);
router.delete('/remove', removeItemFromCart);
router.get('/:customerId', viewCart);
router.post('/checkout', checkoutCart);
router.post('/clear', clearCart);

module.exports = router;
