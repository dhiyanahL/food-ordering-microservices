const mongoose = require('mongoose');

const restaurantNotificationSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant',
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info',
  },
  read: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('RestaurantNotification', restaurantNotificationSchema);
