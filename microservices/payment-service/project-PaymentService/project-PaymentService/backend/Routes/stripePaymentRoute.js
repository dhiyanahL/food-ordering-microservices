const express = require('express');
const router = express.Router();
const {createPaymentIntent,checkPaymentStatus,getPaymentList,refundPayment,fetchPaymentsForRestaurant} = require('../controller/stripePaymentConroller');



router.post('/createPaymentIntent',createPaymentIntent);
//router.get('/checkPaymentStatus/:id', checkPaymentStatus);
router.get('/viewPaymentHistory',getPaymentList);//:id should be added once the user part received
router.post('/refundPayment',refundPayment);
router.get('/fetchPaymentsForRestaurant',fetchPaymentsForRestaurant);//:id should be added once the user part received


module.exports = router;