const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Preparing', 'Sent to Deliver', 'Delivered', 'Canceled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Not Paid', 'Paid', 'Refunded'],
        default: 'Paid'
    },
    refundedAmount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Order', orderSchema);