const jwt = require('jsonwebtoken');
const User = require('../models/user');

// GENERATE TOKEN
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, role, address, phoneNumber } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    if ((role === 'Customer' || role === 'RestaurantAdmin') && !address) {
      return res.status(400).json({ message: 'Address is required for Customer and RestaurantAdmin roles' });
    }

    const user = new User({ name, email, password, role, address, phoneNumber });
    await user.save();
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const googleCallback = (req, res) => {
  const token = generateToken(req.user);
  
  res.redirect(`http://localhost:5173/auth-success?token=${token}`);
};

const facebookCallback = (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`http://localhost:5173/auth-success?token=${token}`);
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  googleCallback,
  facebookCallback,
  logoutUser,
};
