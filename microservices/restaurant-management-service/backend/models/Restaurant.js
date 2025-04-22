const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    contactNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    address: {
      type: String,
      required: true,
    },
    openTime: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, "Please use HH:MM format"],
    },
    closeTime: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, "Please use HH:MM format"],
    },
    cuisineType: {
      type: [String],
      enum: [
        "Sri Lankan",
        "Indian",
        "Chinese",
        "Fast Food",
        "Pizza",
        "Bakery",
        "Seafood",
        "Other",
      ],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true
    }, 
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },   
    ownerId: {
      type: String,
      required: true,
    },    
  },
  { timestamps: true }
);

//Create a mongoose model
const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
