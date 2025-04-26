const express = require('express');
const router = express.Router();

const {
  registerRestaurant,
  getAllRestaurants,
  getMyRestaurants,
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

const { authMiddleware } = require('../middleware/authMiddleware');

const { getRestaurantOrders } = require('../controllers/restaurantOrderController');

router.post('/',authMiddleware, registerRestaurant);
router.get('/', getAllRestaurants);
router.get('/my', authMiddleware, getMyRestaurants);
router.get('/approved', getApprovedRestaurants);
router.get('/search', searchRestaurants);
router.get('/open', getOpenRestaurants);
router.put('/:id/approve', updateRestaurantStatus);
router.get('/:id', getRestaurantById);
router.put('/:id', updateRestaurantDetails);
router.delete('/:id', deleteRestaurant);
//router.put('/:id', authMiddleware, updateRestaurantDetails);
//router.delete('/:id', authMiddleware, deleteRestaurant);
router.get("/category/:category", getRestaurantsByCategory);
router.get('/owner/:ownerId', getRestaurantsByOwner);
router.get('/:id/status', checkOpenCloseStatus);

router.get('/:restaurantId/orders', getRestaurantOrders);

module.exports = router;
