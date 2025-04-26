const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT  = 8000;
//const ngrok = require('ngrok');

const createPaymentIntentRoute = require('./Routes/stripePaymentRoute');




app.use(cors());
app.use(express.json());

app.use('/api/Payment',createPaymentIntentRoute);



mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser : true, useUnifiedTopology : true})
.then((message)=>{

    console.log("Connected With MongoDB Successfully");
}).catch((err)=>{

    console.log(err);
})

app.listen(PORT, async()=>{

    console.log(`Server Is Running On Port ${PORT}`);
   /*try {
        const url = await ngrok.connect(PORT);
        console.log(`Ngrok tunnel is live at: ${url}`);
      } catch (err) {
        console.error('Error starting ngrok:', err);
      }
    */
 

})

