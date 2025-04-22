const Offer = require('../models/Offer');

// Create offer
const createOffer = async (req, res) => {
  try {
    console.log("Received request to create an offer");
    const { title, description, discountPercentage, validFrom, validTill } = req.body;

    const newOffer = new Offer({
      title,
      description,
      discountPercentage,
      validFrom,
      validTill
    });

    await newOffer.save();
    res.status(201).json({ message: 'Offer created successfully', offer: newOffer });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'Server error while creating offer' });
  }
};

// Get all offers
const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offers' });
  }
};

module.exports = { createOffer, getAllOffers };
