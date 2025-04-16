const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    restaurantId: {
        type: String,
        required: true
    },
    currencyCode: {
        type: String,
        default: 'USD',
        required: true
    },
    items: [
        {
            itemId: String,
            itemName: String,
            quantity: Number,
            price: Number,
        }
    ],
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Cart', cartSchema);