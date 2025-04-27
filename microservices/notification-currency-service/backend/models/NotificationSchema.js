const mongoose = require('mongoose');

const Notification = new mongoose.Schema({

    userId : {type : String, required : true},
    message : {type : String, required : true},
    createdAt: {type : Date ,default : Date.now},
    seen : {type : Boolean, default : false},
    seenAt : {type : Date , default : null},
    
})

const newNotification = mongoose.model('Notification', Notification);
module.exports = newNotification;