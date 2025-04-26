const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      default: null //Optional:Only shown if there's a discount
    },
    imageUrl: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },  
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);