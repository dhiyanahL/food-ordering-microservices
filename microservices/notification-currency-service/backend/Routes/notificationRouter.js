const{createNotification,retrieveNotifications,updateSeenStatus,retrieveSeenNotifications} = require('../controller/notificationController');
const express = require('express');
const router = express.Router();

router.post('/createNotification', createNotification);
router.get('/retriveNotification/:id',retrieveNotifications);
router.put('/updateSeenNotification/:id',updateSeenStatus);
router.get('/retrieveSeenNotificationList/:id',retrieveSeenNotifications);

module.exports = router;