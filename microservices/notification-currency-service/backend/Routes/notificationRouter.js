const{createNotification,retrieveNotifications,updateSeenStatus,retrieveSeenNotifications} = require('../controller/notificationController');
const express = require('express');
const router = express.Router();
const sendNotification = require('../utilities/Notification')

router.post('/createNotification', createNotification);
router.get('/retriveNotification/:id',retrieveNotifications);
router.put('/updateSeenNotification/:id',updateSeenStatus);
router.get('/retrieveSeenNotificationList/:id',retrieveSeenNotifications);
router.post('/sendNotification',sendNotification);

module.exports = router;