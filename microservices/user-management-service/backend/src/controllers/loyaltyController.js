const User = require('../models/user');

// Calculate membership tier
const calculateMembershipTier = (points) => {
  if (points >= 500) return 'Gold';
  if (points >= 200) return 'Silver';
  return 'Bronze';
};

const getLoyaltyPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ points: user.loyaltyPoints });
  } catch (err) {
    res.status(500).json({ message: "Error fetching loyalty points" });
  }
};

const addLoyaltyPoints = async (req, res) => {
  const { points } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.loyaltyPoints += points;
    user.membershipTier = calculateMembershipTier(user.loyaltyPoints);
    await user.save();
    res.status(200).json({ message: "Points added", totalPoints: user.loyaltyPoints, newTier: user.membershipTier });
  } catch (err) {
    res.status(500).json({ message: "Error adding loyalty points" });
  }
};

const redeemLoyaltyPoints = async (req, res) => {
  const { pointsToRedeem } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (user.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({ message: "Not enough points to redeem" });
    }

    let multiplier = 1;
    if (user.membershipTier === 'Silver') multiplier = 1.2;
    if (user.membershipTier === 'Gold') multiplier = 1.5;

    const discountValue = pointsToRedeem * multiplier;
    user.loyaltyPoints -= pointsToRedeem;
    user.membershipTier = calculateMembershipTier(user.loyaltyPoints);
    await user.save();

    res.status(200).json({
      message: `Redeemed ${pointsToRedeem} points for Rs.${discountValue.toFixed(2)} discount`,
      remainingPoints: user.loyaltyPoints,
      newTier: user.membershipTier,
      discountValue: discountValue.toFixed(2)
    });

  } catch (err) {
    res.status(500).json({ message: "Error redeeming points", error: err.message });
  }
};

const simulateOrderLoyalty = async (req, res) => {
  const mockOrderTotal = req.body.orderTotal || 350;
  const pointsEarned = Math.floor(mockOrderTotal / 10);
  try {
    const user = await User.findById(req.user.id);
    user.loyaltyPoints += pointsEarned;
    user.membershipTier = calculateMembershipTier(user.loyaltyPoints);
    await user.save();

    res.status(200).json({
      message: `Simulated order of Rs.${mockOrderTotal} - Earned ${pointsEarned} points`,
      totalPoints: user.loyaltyPoints,
      newTier: user.membershipTier
    });
  } catch (err) {
    res.status(500).json({ message: "Simulation failed", error: err.message });
  }
};

module.exports = {
  getLoyaltyPoints,
  addLoyaltyPoints,
  redeemLoyaltyPoints,
  simulateOrderLoyalty,
};
