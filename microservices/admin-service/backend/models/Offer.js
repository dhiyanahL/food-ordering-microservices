const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validTill: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Offer', offerSchema, 'offers'); // collection in admin_db
