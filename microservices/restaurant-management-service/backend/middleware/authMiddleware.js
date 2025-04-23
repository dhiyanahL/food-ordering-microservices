const jwt = require('jsonwebtoken');
const axios = require('axios');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Call the user service to get full user data
    const response = await axios.get(`http://localhost:5001/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    req.user = response.data;
    next();
  } catch (err) {
    console.error('AUTH ERROR:', err.message);
    res.status(401).json({ message: 'Invalid token or failed to fetch user' });
  }
};

// Optional admin check
const admin = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

module.exports = {
  authMiddleware,
  admin
};
