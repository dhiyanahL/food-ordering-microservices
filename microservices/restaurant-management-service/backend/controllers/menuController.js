const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

//Create a new menu item
//POST /restaurants/:restaurantId/menu
const createMenuItem = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const newItem = new MenuItem({
      restaurant: restaurantId,
      ...req.body,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Get all menu items for a restaurant
//GET /restaurants/:restaurantId/menu
const getMenuItems = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const items = await MenuItem.find({ restaurant: restaurantId });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Update a menu item
//PUT /restaurants/:restaurantId/menu/:menuId
const updateMenuItem = async (req, res) => {
  const { menuId } = req.params;

  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(menuId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Menu Item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Delete a menu item
//DELETE /restaurants/:restaurantId/menu/:menuId
const deleteMenuItem = async (req, res) => {
  const { menuId } = req.params;

  try {
    const deleted = await MenuItem.findByIdAndDelete(menuId);

    if (!deleted) {
      return res.status(404).json({ message: "Menu Item not found" });
    }

    res.status(200).json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Filtering Menus with Promotions
//GET /restaurants/:restaurantId/menu/promotion
const getDiscountedMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const items = await MenuItem.find({
      restaurant: restaurantId,
      originalPrice: { $ne: null }, //Means originalPrice exists
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Search menu items inside a restaurant
//GET /restaurants/:restaurantId/menu/search?query=burger
const searchMenuItems = async (req, res) => {
  const { restaurantId } = req.params;
  const { query } = req.query;

  try {
    const items = await MenuItem.find({
      restaurant: restaurantId,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Filter out only available menu items
//GET /restaurants/:restaurantId/menu/available
const getAvailableMenuItems = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const items = await MenuItem.find({
      restaurant: restaurantId,
      available: true,
    });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
  getDiscountedMenuItems,
  searchMenuItems,
  getAvailableMenuItems,
};
