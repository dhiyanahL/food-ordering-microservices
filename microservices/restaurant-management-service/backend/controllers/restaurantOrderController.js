const axios = require('axios');

// GET orders for a restaurant from order service
const getRestaurantOrders = async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const response = await axios.get(`http://order-service:5500/api/orders`, {
      params: { restaurantId }
    });

    res.json(response.data); // Forward result
  } catch (error) {
    console.error('Error fetching restaurant orders:', error.message);
    res.status(500).json({ message: 'Failed to fetch restaurant orders' });
  }
};

module.exports = { getRestaurantOrders };
