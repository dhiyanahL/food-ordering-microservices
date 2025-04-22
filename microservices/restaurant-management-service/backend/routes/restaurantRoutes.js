const express = require('express');
const router = express.Router();

const {
  registerRestaurant,
  getAllRestaurants,
  getApprovedRestaurants,
  updateRestaurantStatus,
  getRestaurantById,
  updateRestaurantDetails,
  deleteRestaurant,
  searchRestaurants,
  getRestaurantsByCategory,
  getRestaurantsByOwner,
  checkOpenCloseStatus,
  getOpenRestaurants,
} = require('../controllers/restaurantController');

router.post('/', registerRestaurant);
router.get('/', getAllRestaurants);
router.get('/approved', getApprovedRestaurants);
router.get('/search', searchRestaurants);
router.get('/open', getOpenRestaurants);
router.put('/:id/approve', updateRestaurantStatus);
router.get('/:id', getRestaurantById);
router.put('/:id', updateRestaurantDetails);
router.delete('/:id', deleteRestaurant);
router.get("/category/:category", getRestaurantsByCategory);
router.get('/owner/:ownerId', getRestaurantsByOwner);
router.get('/:id/status', checkOpenCloseStatus);

module.exports = router;
