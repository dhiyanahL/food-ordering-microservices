const Offer = require('../models/Offer');
const axios = require("axios");

// Create offer
const createOffer = async (req, res) => {
  try {
    console.log("Received request to create an offer");
    const { title, description, discountPercentage, validFrom, validTill } = req.body;

    // Calculate the status of the offer
    const currentDate = new Date();
    const status = new Date(validTill) < currentDate ? 'expired' : 'ongoing';

    const newOffer = new Offer({
      title,
      description,
      discountPercentage,
      validFrom,
      validTill,
      status, // Adding the status field
    });

    await newOffer.save();
    res.status(201).json({ message: 'Offer created successfully', offer: newOffer });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'Server error while creating offer' });
  }
};

// Edit offer
const editOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, discountPercentage, validFrom, validTill } = req.body;

    // Calculate the new status based on validTill date
    const currentDate = new Date();
    const status = new Date(validTill) < currentDate ? 'expired' : 'ongoing';

    // Update the offer with new data
    const updatedOffer = await Offer.findByIdAndUpdate(
      id,
      { title, description, discountPercentage, validFrom, validTill, status },
      { new: true } // Returns the updated offer
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json({ message: 'Offer updated successfully', offer: updatedOffer });
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ message: 'Server error while updating offer' });
  }
};

// Delete offer
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the offer by its ID
    const deletedOffer = await Offer.findByIdAndDelete(id);

    if (!deletedOffer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer:', error);
    res.status(500).json({ message: 'Server error while deleting offer' });
  }
};

// Get a single offer by ID
const getSingleOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json(offer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    res.status(500).json({ message: 'Server error while fetching offer' });
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

// Get top 5 ongoing offers (only title and description)
const getTop5OngoingOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ status: 'ongoing' })
      .sort({ validTill: 1 })
      .limit(5)
      .select('title description'); // 👈 only select these fields

    
    res.status(200).json({ offers });
  } catch (error) {
    console.error('Error fetching top 5 ongoing offers:', error);
    res.status(500).json({ message: 'Server error while fetching top offers' });
  }
};

const getUserCountsByRole = async (req, res) => {
  try {
    const response = await axios.get("http://user-management-service:5000/api/user/getusercountsbyrole");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user counts:", error);
    res.status(500).json({ message: "Failed to fetch user counts." });
  }
};

module.exports = { createOffer, getAllOffers , editOffer, deleteOffer, getSingleOffer, getTop5OngoingOffers, getUserCountsByRole };



