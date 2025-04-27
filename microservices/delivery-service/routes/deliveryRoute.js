const express = require('express');
const router = express.Router();
const { getDeliveryLocation } = require('../controllers/deliveryController');

router.get('track/:deliveryId', getDeliveryLocation);

module.exports = router;