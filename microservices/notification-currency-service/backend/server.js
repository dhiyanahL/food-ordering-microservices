const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT  = 8000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');


const io = new Server(server, {
  cors: {
      origin: ' http://localhost:5173', 
      methods: ['GET', 'POST']
  }
});


io.on('connection', (socket) => {
  console.log('📡 A user connected:', socket.id);

  socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`🟢 User joined room: ${userId}`);
  });

  socket.on('disconnect', () => {
      console.log('❌ A user disconnected:', socket.id);
  });
});


module.exports = { io };

const notificationEmitter = require('./Routes/notificationRouter');


app.use(cors());
app.use(express.json());


app.use('/api/notification',notificationEmitter);




mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser : true, useUnifiedTopology : true})
.then((message)=>{

    console.log("Connected With MongoDB Successfully");
}).catch((err)=>{

    console.log(err);
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

