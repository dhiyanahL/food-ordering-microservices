
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


router.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
    const endpointSecret = 'whsec_9H4ncMlsq50wy8mZK5Omyq85Jobs4mBL'; 
    const sig = req.headers['stripe-signature'];
    
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log('⚠️ Webhook signature verification failed.');
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // 🎯 Handle only payment success
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('✅ Payment Succeeded:', paymentIntent.id);
      // 👉 Do something in your DB, like mark order as paid
    }
  
    res.json({ received: true });
  });

  module.exports = router;