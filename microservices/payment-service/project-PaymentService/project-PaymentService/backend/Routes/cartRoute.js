const {addItem} = require('../controller/cartController');
const express = require('express');
const router = express.Router();


router.post('/addItem',addItem);

module.exports = router;