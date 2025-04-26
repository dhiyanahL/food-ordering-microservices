const express = require('express');
const router = express.Router();

const {
  createOwnerNotification,
  getOwnerNotifications,
  markOwnerNotificationRead,
  deleteOwnerNotification,
} = require('../controllers/restaurantOwnerNotificationController');

// All notifications for one restaurant
router.get('/:restaurantId', getOwnerNotifications);

// Create new notification
router.post('/', createOwnerNotification);

// Mark one as read
router.patch('/:id/read', markOwnerNotificationRead);

// Delete
router.delete('/:id', deleteOwnerNotification);

module.exports = router;
