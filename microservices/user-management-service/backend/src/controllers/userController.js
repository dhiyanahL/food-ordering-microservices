const User = require("../models/user");
const bcrypt = require("bcrypt");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

  const { name, email, oldPassword, newPassword, phoneNumber, address } = req.body;

  user.name = name || user.name;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.address = address || user.address;

  if (oldPassword && newPassword) {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long" });
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
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: "User deleted" });
};
