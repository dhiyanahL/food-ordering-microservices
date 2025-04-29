const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({

    paymentId : {type : String, required : true},
    paymentDate : {type : Date, required : true},
    amount : {type : Number, required : true},
    paymentMethod : {type : String,required : true},
    stripeCustomerId : {type : String, required : true},
    userId : {type : String, required : true},
    restaurantId : {type : String, required : true},
    cartId : {type : String, required : true},
    paymentStatus : {type : String, required : true}
})

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;