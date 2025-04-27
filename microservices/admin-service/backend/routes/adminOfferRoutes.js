const express = require('express');
const { createOffer, getAllOffers, editOffer, deleteOffer, getSingleOffer, getTop5OngoingOffers } = require('../controllers/offerController');


const router = express.Router();

router.post('/offers',  createOffer);
router.get('/offers/top-5', getTop5OngoingOffers);
router.get('/offers/:id', getSingleOffer);
router.get('/offers', getAllOffers);
router.put('/offers/:id', editOffer);
router.delete('/offers/:id', deleteOffer);


module.exports = router;
