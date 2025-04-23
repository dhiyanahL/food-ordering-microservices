const express = require("express");
const { authMiddleware, admin } = require("../middleware/authMiddleware");
const {
  getProfile,
  editProfile,
  deleteUser,
  getUsers,
} = require("../controllers/userController");
const {
  getLoyaltyPoints,
  addLoyaltyPoints,
  redeemLoyaltyPoints,
  simulateOrderLoyalty,
} = require("../controllers/loyaltyController");
const {
  updateRating,
  getAverageRating,
} = require("../controllers/ratingController");

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

// RATING ORDER ROUTES
router.post("/update-rating", authMiddleware, updateRating);
router.post("/average-rating", authMiddleware, getAverageRating);

// ADMIN ROUTES
router.get("/sys-admin/getusers", authMiddleware, admin, getUsers);

module.exports = router;
