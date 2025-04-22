const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({


    //userId : { type : String, required : true},
    //orderId : {type : String, required : true},
    item :[{

       name : {type : String, required : true},
       price : {type : Number, required : true},
       quantity : {type : Number, required : true, default : 1}
    }],
    totalAmount : {type : Number,  default : 0},

    


}, {timestamps : true})


const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;