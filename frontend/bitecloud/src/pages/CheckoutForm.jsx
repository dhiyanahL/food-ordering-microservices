
import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';
import {Elements,CardElement,useStripe,useElements,  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,} from '@stripe/react-stripe-js';
import axios from 'axios';
import Footer from "../components/Footer";
import { useNavigate } from 'react-router-dom';


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

const CheckoutForm = ({userId,cartId,restaurantId})=>{

    const stripe = useStripe();
    const elements = useElements();
    const[loading, setLoading] = useState(false);
    const [brand, setBrand] = useState("");
    const[message,setMessage] = useState('');
    const[total,setTotal] = useState();
    const navigate = useNavigate();

    //const[cartId,setCartId] = useState();
    //const[restaurantId,setRestaurantId] = useState();
    //const[total,setTotal] =useState();
    //const userId = localStorage.getItem('userId');
    console.log(userId);
    
   console.log(restaurantId);
   console.log(cartId);
   //console.log(total);
  
   
    

    useEffect(()=>{

      const fetchCart = async()=>{


        const res =await axios.get(`http://localhost:5500/api/cart/${userId}`);
        setTotal(res.data.cart.totalPrice);
      }

      fetchCart();

    },[userId])

  
   

    

    const handleSubmit =async (e)=>{

        e.preventDefault();
        setLoading(true);



        
        const {data} = await axios.post('http://localhost:5300/api/Payment/createPaymentIntent', {amount : Math.round(total * 100) , currency : "USD", userId : userId,cartId : cartId, restaurantId : restaurantId});
        
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
          const statusRes = await axios.post('http://localhost:5300/api/Payment/checkPaymentStatus', {
            paymentIntentId: result.paymentIntent.id,
            userId : userId,
            cartId : cartId,
            restaurantId : restaurantId

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

    <div

    className="flex min-h-screen flex-col"
      style={{
        backgroundImage: `url('/images/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    
    >
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
  {loading ? 'Processing...' : `Pay ${total} USD`}
</button>


{message && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: "100vw",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      backdropFilter: "blur(3px)",
    }}
  >
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "40px 32px",
        borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
        textAlign: "center",
        maxWidth: "420px",
        width: "90%",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="#16a34a"
        className="mx-auto mb-4"
        style={{ height: "60px", width: "60px" }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
      <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px", color: "#111827" }}>
        Payment Successful
      </h3>
      <p style={{ fontSize: "16px", color: "#4b5563", marginBottom: "24px" }}>
        Your payment has been processed successfully. A confirmation will be sent to your email.
      </p>
      <button
        onClick={() => {
          setMessage("");
          navigate("/customer/dashboard");
        }}
        style={{
          backgroundColor: "#16a34a",
          color: "white",
          padding: "12px 24px",
          borderRadius: "8px",
          border: "none",
          fontWeight: "600",
          fontSize: "15px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  </div>
)}



  </form>

  <Footer />
  </div>
  
  
  );
};

const StripePayment = () => {
  const location = useLocation();
  const { customerId, cartId, restaurantId} = location.state || {};

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm 
        userId={customerId} 
        cartId={cartId} 
        restaurantId={restaurantId} 
        
        
      />
    </Elements>
  );
};



export default StripePayment;
