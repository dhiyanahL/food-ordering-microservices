
import React, {useState, useEffect} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements,CardElement,useStripe,useElements,  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,} from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51R7BxcCBxogx844uoIAybAnwKxST2s0masN22BgkqMpLjD5RkqIHDYIwDT2QedEN7gZZrQA9fI0hsGCtI6vnxdwu00SK0KxCx4');

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#111827",
      letterSpacing: "0.025em",
      fontFamily: "monospace",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

const CheckoutForm = ({totalAmount,userId,cartId,restaurantId})=>{

    const stripe = useStripe();
    const elements = useElements();
    const[loading, setLoading] = useState(false);
    const [brand, setBrand] = useState("");
    const[message,setMessage] = useState('');
    

    

    const handleSubmit =async (e)=>{

        e.preventDefault();
        setLoading(true);



        totalAmount = totalAmount * 293;
        const {data} = await axios.post('http://localhost:8000/api/Payment/createPaymentIntent', {amount : 2000, currency : "USD"});
        
    const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });
  
      
      if (result.error) {
        setMessage(result.error.message);
      } else {
        setMessage("Payment successful! 🎉 ");
      }
  
      setLoading(false);



      if(result && result.paymentIntent && result.paymentIntent.status === "succeeded") {


        try {
          const statusRes = await axios.post('http://localhost:8000/api/Payment/checkPaymentStatus', {
            paymentIntentId: result.paymentIntent.id,
            userId : "L1234",
            cartId : "C1234",
            restaurantId : "res1234"

          });
      
          console.log("Payment Status:", statusRes.data.status);
      
      
        } catch (err) {
          console.error("Error checking payment status:", err);
        }
    
      }

      



    }

    const handleBrand = (event) => {
      setBrand(event.brand);
    };

    const getBrandLogo = () => {
      switch (brand) {
        case "visa":
          return "https://img.icons8.com/color/48/000000/visa.png";
        case "mastercard":
          return "https://img.icons8.com/color/48/000000/mastercard-logo.png";
        case "amex":
          return "https://img.icons8.com/color/48/000000/amex.png";
        default:
          return null;
      }
    };


    
  return (
    <form
    onSubmit={handleSubmit}
   className="w-[580px] mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-200"
  >
    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
      💳 Secure Checkout
    </h2>

    <h2 className='text-left'> Pay With</h2>
    <div className="flex items-center gap-2">
  <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-9 w-9 "/>
  <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" alt="Master Card" className="h-9 w-9"/>
  <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" className="h-9 w-9" />
</div>


    

  
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
          Card Number
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 transition">
          <CardNumberElement
           options={CARD_OPTIONS} 
           onChange={handleBrand} />
               {brand && (
        <div className="flex justify-end">
          <img src={getBrandLogo()} alt={brand} className="h-8" />
        </div>
      )}

        
        </div>
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
          Expiry Date
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 transition">
          <CardExpiryElement options={CARD_OPTIONS} />
        </div>
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1 text-left">
          CVC
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-500 transition">
          <CardCvcElement options={CARD_OPTIONS} />
        </div>
      </div>
    </div>
  
    <button
  type="submit"
  disabled={!stripe || loading}
  style={{
    width: '100%',
    color: 'white',
    fontWeight: '600',
    padding: '10px 16px',
    borderRadius: '8px',
    marginTop: '16px',
    transition: 'background-color 0.3s ease',
    backgroundColor: !stripe || loading ? '#67AE6E' : '#87A922', // light green if disabled, dark green if enabled
    cursor: !stripe || loading ? 'not-allowed' : 'pointer',
    opacity: !stripe || loading ? 0.6 : 1,
    border: 'none',
  }}
>
  {loading ? 'Processing...' : 'Pay 2000'}
</button>


{message && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: "100vw",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        textAlign: "center",
        maxWidth: "400px",
        width: "90%",
      }}
    >
      <p
        style={{
          color: message.includes("successful") ? "#16a34a" : "#dc2626",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      >
        {message}
      </p>
      <button
        onClick={() => setMessage("")}
        style={{
          backgroundColor: "#16a34a",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Okay
      </button>
    </div>
  </div>
)}


  </form>
  
  );
};

const StripePayment = ({totalAmount}) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm totalAmount={totalAmount}/>
    </Elements>
);


export default StripePayment;
