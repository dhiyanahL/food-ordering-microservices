const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('DB connection error : ', err));

//Routes
const restaurantRoutes = require('./routes/restaurantRoutes');
app.use('/restaurants', restaurantRoutes);

const menuRoutes = require('./routes/menuRoutes');
app.use('/restaurants/:restaurantId/menu', menuRoutes);

const restaurantOwnerNotificationRoutes = require('./routes/restaurantOwnerNotificationRoutes');
app.use('/restaurant-notifications', restaurantOwnerNotificationRoutes);

// Basic route to test
app.get('/', (req, res) => {
    res.send('Restaurant Management Service is running');
  });

//Start the server
app.listen(PORT, () => {
    console.log(`Restaurant Management Service running at http://localhost:${PORT}`);
});

