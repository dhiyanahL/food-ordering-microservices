const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async(req , res)=>{

    try{

        
       
        const {amount, currency/*userId,cartId,restaurantId*/} = req.body;
        let stripeMockCustomerId = null
        if(!stripeMockCustomerId){

            const customer = await stripe.customers.create({

                metadata : {
    
                    email : "mockUser@example.com" 
                },
    
                
            })

            stripeMockCustomerId = customer.id;



        }

       /* const user = await User.findById(userId);
        let stripeCustomerId = user.stripeCustomerId;
        if(!stripeCustomerId){

            const customer = await stripe.customers.create({

                metadata : {
    
                    userId : userId,
                    email : user.email,
                    userName : user.userName
                },
    
                
            })


            stripeCustomerId = customer.id;
            user.stripeCustomerId = customer.id;
            user.save();

        }*/

       
        
        const paymentIntent = await stripe.paymentIntents.create({

            amount,
            currency,
            payment_method_types : ['card'],
            customer : /*stripeCustomerId*/stripeMockCustomerId,
            metadata : {

                cartId : 124,
                restaurantId: 234
            }
           

        });

       // const reply = await stripe.paymentIntents.retrieve(paymentIntent.id)
        //console.log(reply.status);

        

        res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId : paymentIntent.id });
       


    }catch(err){

        res.status(500).json({err : "Server Error Occured"});
        console.log(err);
    }
}


/*exports.checkPaymentStatus = async (req, res) => {
    const { paymentIntentId } = req.params.id;
    //console.log(paymentIntentId);
  
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      //console.log(paymentIntent.status);
     // console.log(paymentIntent.metadata.cartId);
     
      

      res.json({ status: paymentIntent.status });
    } catch (err) {
      res.status(500).json({ err: "Failed to retrieve status" });
    }
  };*/


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
    const paymentIntent = await stripe.paymentIntents.retrieve(/*paymentId*/'pi_3REjBMCBxogx844u1qKzWmyU',{ expand: ['charges'] });
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
  

 
