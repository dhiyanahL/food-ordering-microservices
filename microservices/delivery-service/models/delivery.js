const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    status: {
        type: String,
        enum: ['Assigned', 'Picked-up', 'On the way', 'Delivered'],
        default: 'Pending'
    },
    customerLocation: {
        lat: Number,
        lng: Number
    },
    restaurantLocation: {
        lat: Number,
        lng: Number
    }
});

module.exports = mongoose.model('Delivery', deliverySchema);