//dheeliyaudeen - P2Qd5PYeO31GMdbm

//Main entry point for the API
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import passport from "passport";
import authRoutes from "../backend/src/routes/authRoutes.js";
import userRoutes from "../backend/src/routes/userRoutes.js";
import './config/passport.js'; // This initializes the passport strategies
import cors from 'cors';

dotenv.config();

const app = express();

// Middleware
// Allow all origins (adjust based on your security requirements)
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

//Routes
app.use('/api/auth', authRoutes);   // --> /api/auth/register, /api/auth/login
app.use('/api/user', userRoutes);   // --> /api/user/profile, /api/user/edit

app.listen(5000, () => {
  connectDB();
  console.log("Listening on port 5000");
});
