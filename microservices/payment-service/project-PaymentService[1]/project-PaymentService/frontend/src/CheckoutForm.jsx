
import React, {useState, useEffect} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements,CardElement,useStripe,useElements} from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51R7BxcCBxogx844uoIAybAnwKxST2s0masN22BgkqMpLjD5RkqIHDYIwDT2QedEN7gZZrQA9fI0hsGCtI6vnxdwu00SK0KxCx4');



const CheckoutForm = ({totalAmount})=>{

    const stripe = useStripe();
    const elements = useElements();
    const[loading, setLoading] = useState(false);
    const[message,setMessage] = useState('');

    const handleSubmit =async (e)=>{

        e.preventDefault();
        setLoading(true);



        totalAmount = totalAmount * 293;
        const {data} = await axios.post('http://localhost:8000/api/Payment/createPaymentIntent', {amount : 2000, currency : "USD"});
        
    const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
  
      
      if (result.error) {
        setMessage(result.error.message);
      } else {
        setMessage("Payment successful! 🎉 " +result.paymentIntent.id);
      }
  
      setLoading(false);

      if(result && result.paymentIntent && result.paymentIntent.status === "succeeded") {


        //Create A dilivery order of a pre-payment
    
      }

      



    }


    
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
      💳 Payment Details
    </h2>

    <div className="p-3 border border-gray-300 rounded-md bg-gray-50"> <CardElement /> </div>
      
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
      <p>{message}</p>
    </form>
  );
};

const StripePayment = ({totalAmount}) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm totalAmount={totalAmount}/>
    </Elements>
);


export default StripePayment;
