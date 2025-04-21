const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5100;

//Middleware
app.use(express.json());

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('DB connection error : ', err));

//Routes
const restaurantAdminRoutes = require('./routes/restaurantAdminRoutes');
app.use('/admin', restaurantAdminRoutes);

//Basic route to test
app.get('/', (req, res) => {
  res.send('Admin Service is running');
});

//Start the server
app.listen(PORT, () => {
  console.log(`Admin Service running at http://localhost:${PORT}`);
});
