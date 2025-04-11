import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import admin from '../middleware/authMiddleware.js';
import {
  getProfile,
  editProfile,
  deleteUser,
  getUsers,
} from '../controllers/userController.js';

const router = express.Router();

//PROTECTED ROUTES
router.get('/profile', authMiddleware, getProfile);
router.put('/edit', authMiddleware, editProfile);
router.delete('/delete', authMiddleware, deleteUser);

//ADMIN ROUTES
router.get("/", authMiddleware, admin, getUsers); // Only admin can get all users

export default router;
