import User from '../models/user.js';



// Get user's loyalty points

export const getLoyaltyPoints = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      res.status(200).json({ points: user.loyaltyPoints });
    } catch (err) {
      res.status(500).json({ message: "Error fetching loyalty points" });
    }
  };
  
  // Add points (e.g., after successful order)
  export const addLoyaltyPoints = async (req, res) => {
    const { points } = req.body;
    try {
      const user = await User.findById(req.user.id);
      user.loyaltyPoints += points;
      user.membershipTier = calculateMembershipTier(user.loyaltyPoints); // Tier update
      await user.save();
      res.status(200).json({ message: "Points added", totalPoints: user.loyaltyPoints, newTier: user.membershipTier  });
    } catch (err) {
      res.status(500).json({ message: "Error adding loyalty points" });
    }
  };


// Calculate membership tier
  const calculateMembershipTier = (points) => {
    if (points >= 500) return 'Gold';
    if (points >= 200) return 'Silver';
    return 'Bronze';
  };
  
  // Redeem points
  export const redeemLoyaltyPoints = async (req, res) => {
    const { pointsToRedeem } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
  
      if (user.loyaltyPoints < pointsToRedeem) {
        return res.status(400).json({ message: "Not enough points to redeem" });
      }
  
      // Tier-based multiplier
      let multiplier = 1; // default for Bronze
      if (user.membershipTier === 'Silver') multiplier = 1.2;
      if (user.membershipTier === 'Gold') multiplier = 1.5;
  
      const discountValue = pointsToRedeem * multiplier;
  
      // Deduct points and update tier
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
  
  
  
  // TEMP: Simulate a successful order and award loyalty points
export const simulateOrderLoyalty = async (req, res) => {
    const mockOrderTotal = req.body.orderTotal || 350; // fallback mock value
    const pointsEarned = Math.floor(mockOrderTotal / 10);
  
    try {
      const user = await User.findById(req.user.id);
      user.loyaltyPoints += pointsEarned;
      user.membershipTier = calculateMembershipTier(user.loyaltyPoints); // Tier update
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