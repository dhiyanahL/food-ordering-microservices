const express = require('express');
const router = express.Router({mergeParams:true});

const{
    createMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem,
    getDiscountedMenuItems,
    searchMenuItems,
    getAvailableMenuItems,
} = require('../controllers/menuController');

router.post('/', createMenuItem);
router.get('/', getMenuItems);
router.put('/:menuId', updateMenuItem);
router.delete('/:menuId', deleteMenuItem);

router.get('/promotions', getDiscountedMenuItems);

router.get('/search', searchMenuItems);

router.get('/available', getAvailableMenuItems);

module.exports = router;