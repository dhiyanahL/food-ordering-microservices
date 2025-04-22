const Restaurant = require("../models/Restaurant");
const axios = require("axios");

//Register a new restaurant
//POST /restaurants
const registerRestaurant = async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    const savedRestaurant = await newRestaurant.save();

    //Send notifcation to admin service
    await axios.post("http://localhost:5100/admin/notifications", {
      message: `New Restaurant registered: ${savedRestaurant.name}`,
      type: "info",
    });

    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Get all restaurants
//GET /restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get only approved restaurants
//GET /restaurants/approved
const getApprovedRestaurants = async (req, res) => {
  try {
    const approvedRestaurants = await Restaurant.find({ status: "approved" });
    res.status(200).json(approvedRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Approve or reject a restaurant
//PUT /restaurants/:restaurantId/approve
const updateRestaurantStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Restaurant.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    //Auto-notification to admin
    if (status === "approved" || status === "rejected") {
      await axios.post("http://localhost:5100/admin/notifications", {
        message: `Restaurant ${status}: ${updated.name}`,
        type: status === "approved" ? "success" : "warning",
      });
    }

    //Notify the restaurant owner
    await axios.post("http://localhost:5000/restaurant-notifications", {
      restaurantId: updated._id,
      message: `Your restaurant was ${status} by the system admin.`,
      type: status === "approved" ? "success" : "warning",
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Get a single restaurant by ID
//GET /restaurants/:restaurantId
const getRestaurantById = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update restaurant details by ID
//PUT /restaurants/:restaurantId
const updateRestaurantDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const updateRestaurant = await Restaurant.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateRestaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(updateRestaurant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Delete a restaurant by ID
//DELETE /restaurants/:restaurantId
const deleteRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findByIdAndDelete(id);

    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({ messgae: "Restaurant successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Search restaurants by name or cuisine
//GET /restaurants/search?query=something
const searchRestaurants = async (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query must be a string" });
  }

  try {
    const restaurants = await Restaurant.find({
      status: "approved",
      $or: [
        { name: { $regex: query, $options: "i" } },
        { cuisineType: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get restaurants by cuisine category
//GET /restaurants/category/:category
const getRestaurantsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const restaurants = await Restaurant.find({
      status: "approved",
      cuisineType: category,
    });

    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Fetch restaurant by owner
//GET /restaurants/owner/:ownerId
const getRestaurantsByOwner = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const restaurants = await Restaurant.find({ ownerId });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Only open restaurants
//GET /restaurants/:restaurantId/status
const checkOpenCloseStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await Restaurant.findOne({ _id: id, status: "approved" });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found or not approved" });

    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const currentMinute = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;

    let isOpen = false;

    // Handles normal and overnight timings
    if (restaurant.openTime < restaurant.closeTime) {
      isOpen = currentTime >= restaurant.openTime && currentTime < restaurant.closeTime;
    } else {
      isOpen = currentTime >= restaurant.openTime || currentTime < restaurant.closeTime;
    }

    res.json({ isOpen });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get all open restaurants
//GET /restaurants/open
const getOpenRestaurants = async (req, res) => {
  try {
    const allApproved = await Restaurant.find({ status: "approved" });
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const openRestaurants = allApproved.filter(restaurant => {
      if (restaurant.openTime < restaurant.closeTime) {
        return currentTime >= restaurant.openTime && currentTime < restaurant.closeTime;
      } else {
        return currentTime >= restaurant.openTime || currentTime < restaurant.closeTime;
      }
    });

    res.status(200).json(openRestaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerRestaurant,
  getAllRestaurants,
  getApprovedRestaurants,
  updateRestaurantStatus,
  getRestaurantById,
  updateRestaurantDetails,
  deleteRestaurant,
  searchRestaurants,
  getRestaurantsByCategory,
  getRestaurantsByOwner,
  checkOpenCloseStatus,
  getOpenRestaurants,
};
