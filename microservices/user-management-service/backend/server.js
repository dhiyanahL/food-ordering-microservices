//dheeliyaudeen - P2Qd5PYeO31GMdbm

//Main entry point for the API
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
//app.use(passport.initialize());

app.listen(5000, () => {
  connectDB();
  console.log("Listening on port 5000");
});
