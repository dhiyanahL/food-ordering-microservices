const axios = require("axios");
const Notification = require("../models/RestaurantNotification");

//Approve or reject a restaurant
//PUT /admin/restaurants/:id/status
const updateRestaurantStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    //Get restaurant details from restaurant service
    const response = await axios.get(`http://restaurant-management-service:5400/restaurants/${id}`);
    const restaurant = response.data;

    //Update restaurant status in restaurant service
    const updated = await axios.put(`http://restaurant-management-service:5400/restaurants/${id}`, {
      status,
    });

    //Auto-notification
    await axios.post("http://admin-service:5100/admin/notifications", {
      message: `Restaurant ${status}: ${restaurant.name}`,
      type: status === "approved" ? "success" : "warning",
    });

    // Auto-notification for restaurant owner
    await axios.post("http://restaurant-management-service:5400/restaurant-notifications", {
      restaurantId: restaurant._id,
      message: `Your restaurant was ${status} by the system admin.`,
      type: status === "approved" ? "success" : "warning",
    });

    res.status(200).json(updated.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Create a new admin notification
//POST /admin/notifications
const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Get all admin notifications
//GET /admin/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Mark a notification as read
//PATCH /admin/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Notification not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Delete a notification
//DELETE /admin/notifications/:id
const deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Notification not found" });
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete a restaurant
//DELETE /admin/restaurants/:id
const deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    // Get restaurant details
    const response = await axios.get(`http://restaurant-management-service:5400/restaurants/${id}`);
    const restaurant = response.data;

    // Delete the restaurant
    await axios.delete(`http://restaurant-management-service:5400/restaurants/${id}`);

    // Notify the system admin
    await axios.post("http://admin-service:5100/admin/notifications", {
      message: `Restaurant deleted: ${restaurant.name}. Reason: ${reason}`,
      type: "error",
    });

    // Notify the restaurant owner
    await axios.post("http://restaurant-management-service:5400/restaurant-notifications", {
      restaurantId: restaurant._id,
      message: `Your restaurant was deleted by the system admin. Reason: ${reason}`,
      type: "error",
    });

    res.status(200).json({ message: "Restaurant deleted and owner notified." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get summary statistics for restaurants in the Admin Dashboard
//GET /admin/dashboard/restaurant-summary
const getRestaurantSummary = async (req, res) => {
  try {
    const response = await axios.get("http://restaurant-management-service:5400/restaurants");
    const restaurants = response.data;

    const totalRestaurants = restaurants.length;
    const pending = restaurants.filter((r) => r.status === "pending").length;
    const approved = restaurants.filter((r) => r.status === "approved").length;
    const rejected = restaurants.filter((r) => r.status === "rejected").length;

    res.status(200).json({
      totalRestaurants,
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get cuisine type distribution for all restaurants
//GET /admin/restaurant-stats/cuisine-summary
const getCuisineSummary = async (req, res) => {
  try {
    const response = await axios.get("http://restaurant-management-service:5400/restaurants");
    const restaurants = response.data;

    const cuisineCounts = {};

    restaurants.forEach((restaurant) => {
      restaurant.cuisineType.forEach((cuisine) => {
        cuisineCounts[cuisine] = (cuisineCounts[cuisine] || 0) + 1;
      });
    });

    res.status(200).json(cuisineCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get registration trends of restaurants over time (for admin analytics)
//GET /admin/restaurant-stats/registration-trends
const getRegistrationTrends = async (req, res) => {
  try {
    const response = await axios.get("http://restaurant-management-service:5400/restaurants");
    const restaurants = response.data;

    const trends = {};

    restaurants.forEach((r) => {
      const date = new Date(r.createdAt).toISOString().split("T")[0]; // Format: YYYY-MM-DD
      trends[date] = (trends[date] || 0) + 1;
    });

    res.status(200).json(trends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateRestaurantStatus,
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
  deleteRestaurant,
  getRestaurantSummary,
  getCuisineSummary,
  getRegistrationTrends,
};
