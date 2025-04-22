const express = require('express');
const { createOffer, getAllOffers } = require('../controllers/offerController');


const router = express.Router();

router.post('/offers',  createOffer);
router.get('/offers', getAllOffers);

module.exports = router;
