const User = require("../models/user");

// Update rating
exports.updateRating = async (req, res) => {
  const { userId, rating } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const total = user.totalRatingsCount || 0;
  const currentAvg = user.averageRatingGiven || 0;

  const newAvg = ((currentAvg * total) + rating) / (total + 1);
  user.averageRatingGiven = newAvg;
  user.totalRatingsCount = total + 1;

  await user.save();
  res.json({ message: 'Customer rating updated' });
};

// Get average rating
exports.getAverageRating = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ averageRating: user.averageRatingGiven || 0 });
  } catch (error) {
    console.error('Error getting average rating:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
