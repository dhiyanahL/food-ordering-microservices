const User = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware/authMiddleware");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user counts by role
exports.getUserCountsByRole = async (req, res) => {
  try {
    const counts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(counts);
  } catch (error) {
    console.error("Error fetching user counts by role:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// View profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// Edit profile
exports.editProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const {
    name,
    email,
    oldPassword,
    newPassword,
    phoneNumber,
    address,
    averageRatingGiven,
  } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.address = address || user.address;
  user.averageRatingGiven = averageRatingGiven || user.averageRatingGiven;

  if (oldPassword && newPassword) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  try {
    await user.save();
    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        membershipTier: user.membershipTier,
        loyaltyPoints: user.loyaltyPoints,
        averageRatingGiven: user.averageRatingGiven,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: "User deleted" });
};


/*exports.addFavorite = async (req, res) => {
  const { restaurantId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.favorites.includes(restaurantId)) {
      return res.status(400).json({ message: 'Already favorited' });
    }

    user.favorites.push(restaurantId);
    await user.save();

    res.status(200).json({ message: 'Added to favorites' });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
};*/


/*
// Get Favorites// Get Favorites
exports.getFavorites = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error' });
  }
};*/




exports.fetchUser = async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ err: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ err: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ err: "Server Error Occurred" });
  }
};

exports.updateStripeCustomerId = async (req, res) => {
  const userId = req.params.id;
  const { stripeCustomerId } = req.body; 

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { stripeCustomerId }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Stripe customer ID updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" }); 
  }
};
