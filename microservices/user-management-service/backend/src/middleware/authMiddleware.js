const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};
//ADD AUTHENTICATIONS FOR RES ADMIN + DELIVERY ROUTES

// RestaurantAdmin middleware
const restaurantAdmin = (req, res, next) => {
  if (req.user && req.user.role === "RestaurantAdmin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as a Restaurant Admin");
  }
};

// DeliveryPersonnel middleware
const deliveryPersonnel = (req, res, next) => {
  if (req.user && req.user.role === "DeliveryPersonnel") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as Delivery Personnel");
  }
};


module.exports = {
  authMiddleware,
  admin,
  restaurantAdmin,
  deliveryPersonnel
};
