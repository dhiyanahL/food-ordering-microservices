const express = require("express");
const { authMiddleware, admin } = require("../middleware/authMiddleware");
const {
  getProfile,
  editProfile,
  deleteUser,
  getUsers,
  //addFavorite,
  //getFavorites,
  fetchUser,
  getUserCountsByRole
} = require("../controllers/userController");
const {
  getLoyaltyPoints,
  addLoyaltyPoints,
  redeemLoyaltyPoints,
  simulateOrderLoyalty,
} = require("../controllers/loyaltyController");
const User = require("../models/user");


const router = express.Router();

// PROTECTED ROUTES - CUSTOMER PROFILE
router.get("/profile", authMiddleware, getProfile);
router.put("/edit", authMiddleware, editProfile);
router.delete("/delete", authMiddleware, deleteUser);

// LOYALTY POINTS ROUTES
router.get("/loyalty", authMiddleware, getLoyaltyPoints);
router.post("/loyalty/add", authMiddleware, addLoyaltyPoints);
router.post("/loyalty/redeem", authMiddleware, redeemLoyaltyPoints);
router.post("/loyalty/simulate-order", authMiddleware, simulateOrderLoyalty);


// FAVORITES ROUTES
//router.post("/favorites/add", authMiddleware, addFavorite);
//router.get("/favorites", authMiddleware, getFavorites);

const axios = require("axios");

router.post("/favorites/add", authMiddleware, async (req, res) => {
  const { restaurantId } = req.body;
  const userId = req.user.id;

  try {
    // fetch restaurant details
    const restaurantRes = await axios.get(`http://restaurant-management-service:5400/restaurants/${restaurantId}`);
    const restaurantName = restaurantRes.data.name;
    

    const user = await User.findById(userId);
    const alreadyFavorited = user.favorites.some(fav => fav.restaurantId === restaurantId);

    if (alreadyFavorited) {
      return res.status(400).json({ message: "Restaurant already in favorites." });
    }

    user.favorites.push({ restaurantId, restaurantName });
    await user.save();
    res.status(200).json({ message: "Restaurant added to favorites." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add favorite.", error });
  }
});


router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites.", error });
  }
});

// ADMIN ROUTES
router.get("/admin/getusers", authMiddleware, admin, getUsers);
router.get("/getusercountsbyrole",authMiddleware, getUserCountsByRole);

//Fetch By Payment Gateway
router.get('/fetchUser/:id',fetchUser);

module.exports = router;
