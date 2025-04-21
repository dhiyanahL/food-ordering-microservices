import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import admin from '../middleware/authMiddleware.js';
import {
  getProfile,
  editProfile,
  deleteUser,
  getUsers,
} from '../controllers/userController.js';
import {
  getLoyaltyPoints,
  addLoyaltyPoints,
  redeemLoyaltyPoints,
  simulateOrderLoyalty
} from "../controllers/loyaltyController.js";

import { updateRating, getAverageRating } from "../controllers/ratingController.js";

const router = express.Router();

//PROTECTED ROUTES - CUSTOMER PROFILE
router.get('/profile', authMiddleware, getProfile);
router.put('/edit', authMiddleware, editProfile);
router.delete('/delete', authMiddleware, deleteUser);

//LOYALTY POINTS ROUTES
router.get("/loyalty",authMiddleware , getLoyaltyPoints);
router.post("/loyalty/add", authMiddleware, addLoyaltyPoints); //To be used by Order Component after successful order 
router.post("/loyalty/redeem", authMiddleware, redeemLoyaltyPoints);

router.post("/loyalty/simulate-order", authMiddleware, simulateOrderLoyalty);


//RATING ORDER ROUTES
router.post("/update-rating", authMiddleware, updateRating);  //used with order component
router.post("/average-rating", authMiddleware, getAverageRating);

//ADMIN ROUTES
router.get("/sys-admin/getusers", authMiddleware, admin, getUsers); // Only admin can get all users

export default router;
