// dheeliyaudeen - P2Qd5PYeO31GMdbm

// Main entry point for the API
const express = require("express");
const dotenv = require("dotenv");
const  connectDB  = require("./config/db");
const passport = require("passport");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
require("./config/passport"); // This initializes the passport strategies
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Server Listen
app.listen(5000, () => {
  connectDB();
  console.log("User Management Service : Listening on port 5000");
});
