const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const {Server} = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

//connect to mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

//socket.io connection
io.on('connection', (socket) => {
    console.log('New socket connected: ', socket.id);

    socket.on('joinDeliveryRoom', (deliveryId) => {
        socket.join(deliveryId);
        console.log(`Driver joined room:  ${deliveryId}`);
    });

    socket.on('driverLocation', async({deliveryId, coords}) => {
        const Delivery = require('./models/delivery');
        await Delivery.findByIdAndUpdate(deliveryId, {
            currentDriverLocation: coords
    });

        io.to(deliveryId).emit('locationUpdate', coords);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected: ', socket.id);
    });
});
  

  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});