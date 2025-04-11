import jwt from 'jsonwebtoken';
import User from '../models/user.js';



//TO TEST GOOGLE AUTH - http://localhost:5000/api/auth/google
//TO TEST FACEBOOK AUTH - http://localhost:5000/api/auth/facebook



//GENERATE TOKEN
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password, role });
    await user.save();
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const googleCallback = (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`/auth-success?token=${token}`);
  //res.redirect('/dashboard');// Handle client redirect

};

export const facebookCallback = (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`/auth-success?token=${token}`);
  //res.redirect('/dashboard');// Handle client redirect

};
