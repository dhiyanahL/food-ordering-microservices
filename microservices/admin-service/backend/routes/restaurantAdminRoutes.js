const express = require("express");
const router = express.Router();

const {
  updateRestaurantStatus,
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
  deleteRestaurant,
  getRestaurantSummary,
  getCuisineSummary,
  getRegistrationTrends,
} = require("../controllers/restaurantAdminController");

//Approval
router.put("/restaurants/:id/status", updateRestaurantStatus);

//Notifications
router.post("/notifications", createNotification);
router.get("/notifications", getNotifications);
router.patch("/notifications/:id/read", markAsRead);
router.delete("/notifications/:id", deleteNotification);

//Remove restaurant
router.delete("/restaurants/:id", deleteRestaurant);

//Summary
router.get("/dashboard/restaurant-summary", getRestaurantSummary);
router.get("/restaurant-stats/cuisine-summary", getCuisineSummary);
router.get("/restaurant-stats/registration-trends", getRegistrationTrends);

module.exports = router;
