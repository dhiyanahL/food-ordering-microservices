const Stripe = require('stripe');
const dotenv = require('dotenv');
const Payment = require('../models/PaymentSchema');
const axios = require('axios');
//const sendNotification = require('../utilities/Notification');
//const createInAppNotification = require('./notificationController');

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



exports.createPaymentIntent = async(req , res)=>{

    try{

        
       
       const {amount, currency,userId,cartId,restaurantId} = req.body;
        /*let stripeMockCustomerId = null
        if(!stripeMockCustomerId){

            const customer = await stripe.customers.create({

                metadata : {
    
                    userId ,
                    email : "slholidays2018@gmail.com" ,
                    cartId,
                    restaurantId
                },
    
                
            })

            stripeMockCustomerId = customer.id;*/



        //}

       //Fetch user inside payment-service
         const userResponse = await axios.get(`http://user-management-service:5000/api/user/fetchUser/${userId}`);
         const user = userResponse.data;


       
           
        

        let stripeCustomerId = user.stripeCustomerId;
        if(!stripeCustomerId){

            const customer = await stripe.customers.create({

                metadata : {
    
                    userId : userId,
                    email : user.email,
                    
                },
    
                
            })


            stripeCustomerId = customer.id;
            
            /*await user.updateOne(
              { _id: userId },
              { $set: { stripeCustomerId: customer.id } }
            );*/

       }

        
        
        const paymentIntent = await stripe.paymentIntents.create({

            amount,
            currency,
            /*payment_method_types : ['card'],*/
            automatic_payment_methods: {
              enabled: true, // 🔥 Enables Apple Pay, Google Pay, Link, and card payments automatically
            },
            customer :stripeCustomerId /*stripeMockCustomerId*/,
            metadata : {

                cartId,
                restaurantId
            }
           

        });

       const reply = await stripe.paymentIntents.retrieve(paymentIntent.id)
       //console.log(reply.status);

        

        res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId : paymentIntent.id });
       


    }catch(err){

        res.status(500).json({err : "Server Error Occured"});
        console.log(err);
    }
}



  exports.checkPaymentStatus = async (req, res) => {

  
  const { paymentIntentId, userId, cartId, restaurantId } = req.body;
  //const user = await User.findById(userId);
  const userEmail = /*user.email*/ "slholidays2018@gmail.com";
  //const restaurant = await Restaurant.findById(restaurantId);
  const restaurantEmail = /*restaurant.email*/ "restaurant@example.com" ;




  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const payment = new Payment({
      paymentId: paymentIntentId,
      paymentDate: new Date(paymentIntent.created * 1000),
      amount: paymentIntent.amount,
      paymentMethod: paymentIntent.payment_method_types,
      stripeCustomerId: paymentIntent.customer,
      userId,
      restaurantId,
      cartId,
      paymentStatus: paymentIntent.status
    });

    if(paymentIntent.status == "failed"){

      await axios.post('http://notification-service:5200/api/notification/sendNotification',{

        to: userEmail,
        subject: `Your Delivery Order ${paymentIntentId}`,
        message: `Your Order Placmenet Unsuccess: Amount - ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}`
      })

      console.log('Notification sent to user after payment success.');
      //sendNotification(userEmail,`Payment Unsuccess ${paymentIntentId}`,`Your Order Details As Below ${paymentIntent.amount}`);

    }if(paymentIntent.status == "succeeded"){

      await axios.post('http://notification-service:5200/api/notification/sendNotification',{

        to: userEmail,
        subject: `Your Delivery Order ${paymentIntentId}`,
        message: `Your Order Placmenet Success: Amount - ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()}`
      })

      console.log('Notification sent to user after payment success.');
      //Call the Create Order Controller method
      //Call the create Notification method for confirming the order to show in notification list in the app
      //Call the method Assigning a deliver person
      //Call the create Notification method for informing the delivery person about the delivery and the customer in notification list in the app
      //Call the create notification method for informing the restaurant about the order in notification list in the app
      //send email to restaurant
      //send email to delivery person
      


    }
   

    const saved = await payment.save();
    //console.log(saved.amount);
    
  
   
    res.status(201).json({ message: "Payment saved", data: saved });

  } catch (err) {
    console.error("Payment save error:", err);
    res.status(500).json({ err: "Failed to save payment" });
  }
};



  exports.getPaymentList = async (req, res) => {
    try {

      /*const{userId} = req.params.id;*/
      //const user = await User.findById(userId);
      const stripeCustomerId = /*user.stripeCustomerId*/ "cus_S99Q4W8zrJExIY";
  
      if (!stripeCustomerId) {
        return res.status(404).json({ message: "No Payment History Found" });
      }
  
      const payment = await stripe.paymentIntents.list({ customer: stripeCustomerId });
      
      res.json({ payment });
  
    } catch (error) {
      
      if (error.type === 'StripeInvalidRequestError' && error.code === 'resource_missing') {
        return res.status(404).json({ message: "Customer not found in Stripe" });
      }
  
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Server error while fetching payments" });
    }
  };


  exports.refundPayment = async(req,res) =>{

  try{

    const{userId, orderId, restaurantId} = req.body;
    /*const user = await User.findById(userId);
    const order = await Order.findById(orderId)
    const stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      return res.status(404).json({ message: "No Payment History Found" });
    }

    if(!order){
      return res.status(404).json({ message: "No Order Found" });
    }*/

    /*const paymentId = order.paymentId;*/
    const paymentIntent = await stripe.paymentIntents.retrieve(/*paymentId*/'pi_3RFJpICBxogx844u01I8QdPB',{ expand: ['charges'] });
   // console.log(paymentIntent)
    const chargeId = paymentIntent.latest_charge
    const refund = await stripe.refunds.create({
      charge: chargeId
    });

    res.status(202).json({refund});




  }catch(err){

     
    if (err.type === 'StripeInvalidRequestError' && err.code === 'resource_missing') {
      return res.status(404).json({ message: "Customer not found in Stripe" });
    }

    console.error("Error fetching payments:", err);
    res.status(500).json({ message: "Server error while fetching payments" });


  }
 

  }





 

 
 exports.fetchPaymentsForRestaurant = async(req,res) =>{

  //const {restaurantId} = req.params.id

  let payments = await stripe.paymentIntents.list({limit : 100});
  let filteredPayments = [];

  for(const payment of payments.data){
    if(payment.metadata && payment.metadata.restaurantId === "234"){
      filteredPayments.push(payment);
    }
 
  }

  res.status(202).json({filteredPayments : filteredPayments})
  console.log(filteredPayments);
 }
  

 
 
