const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/top-5", async (req, res) => {
  try {
    const response = await axios.get("http://admin-service:5100/admin/offers/top-5");
    console.log("Received from admin service:", response.data);
    res.json(response.data.offers);
  } catch (error) {
    console.error("Error fetching offers from admin service:", error);
    res.status(500).json({ message: "Failed to fetch offers" });
  }
});

module.exports = router;
