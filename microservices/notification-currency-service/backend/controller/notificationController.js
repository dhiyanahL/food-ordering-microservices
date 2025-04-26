const Notification = require('../models/NotificationSchema');
const {io} = require('../server');

exports.createNotification = async(req,res)=>{

    //const{userId,message} = req.body;
    


    const notification = new Notification({

        userId : "123" /*userId*/ ,
        message : "User 123 you have cancelled the order 124" /*message*/,
       


    })

    const reply = await notification.save();
    if(!reply) return res.status(400).json({message : "error occurred in creating the notification"});
    res.status(202).json({message : "notification created successfully"});
    io.to(123).emit('notification', reply);
   
}


exports.retrieveNotifications = async(req,res) =>{

const userId = req.params.id;
console.log(userId);
/*const user = await User.findById(userId)
if(!user) return res.status(404).json({message : "User Not Found "});
*/

let notification = await Notification.find({userId})
if(!notification) return res.status(404).json({message : "No Notification Found"});
let notificationList = [];

for(const notifications of notification){

    notificationList.push(notifications);
}

res.status(202).json({notifications : notificationList});





}

exports.updateSeenStatus = async (req, res) => {
    const notificationId = req.params.id;
    console.log(notificationId);

    try {
        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { seenAt: Date.now(),seen : true},
            { new: true }
        );

        if (!updatedNotification) {
            return res.status(404).json({ message: "Notification not found or already removed." });
        }

        return res.status(200).json({
            message: "Notification marked as seen.",
            notification: updatedNotification
        });
    } catch (error) {
        console.error("Error updating seen status:", error);
        return res.status(500).json({ message: "Server error while updating notification." });
    }
};


exports.retrieveSeenNotifications = async(req, res) => {

    const userId = req.params.id;
    const readNotifications = await Notification.find({userId});
    let notificationList = [];
    for(const notifications of readNotifications){

        if(notifications.seen == true){

            notificationList.push(notifications);

        }
    }

    res.status(202).json({notificationList});







}