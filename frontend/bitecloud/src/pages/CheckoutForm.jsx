import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CheckoutPage = () => {
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = localStorage.getItem('customerId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Get cart data from order service (port 5500)
        const cartResponse = await axios.get(`http://localhost:5500/api/cart/${customerId}`);
        const cartData = cartResponse.data.cart;
        
        // 2. Get customer details from user service (port 5000)
        const userResponse = await axios.get(`http://localhost:5000/api/users/${customerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        const userData = userResponse.data.user;

        // 3. Set state with real data
        setOrder({
          items: cartData.items,
          totalPrice: cartData.totalPrice,
          restaurantId: cartData.restaurantId
        });

        setCustomer({
          name: userData.name,
          address: userData.address || 'Address not specified',
          phone: userData.phone || 'Phone not specified',
          email: userData.email
        });

      } catch (err) {
        console.error('Error fetching checkout data:', err);
        setError('Failed to load checkout information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  const handlePayment = async () => {
    try {
      // Create order and get payment link
      const res = await axios.post(
        'http://localhost:5500/api/cart/checkout',
        { customerId },
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('jwt')}` 
          }
        }
      );
      
      // Redirect to payment gateway
      window.location.href = res.data.paymentLink;
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to process payment');
    }
  };

  const handleCancelOrder = async () => {
    try {
      await axios.delete(`http://localhost:5500/api/cart/clear`, {
        data: { customerId },
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('jwt')}` 
        }
      });
      navigate('/customer/dashboard');
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg.png)' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
            <p className="text-gray-600">Loading your order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg.png)' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order || !customer) {
    return (
      <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg.png)' }}>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full text-center">
            <p className="text-gray-600">No order information available</p>
            <button
              onClick={() => navigate('/customer/restaurants')}
              className="mt-4 px-4 py-2 bg-[#628b35] text-white rounded hover:bg-[#4a6b2a]"
            >
              Browse Restaurants
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" style={{ backgroundImage: 'url(/images/bg.png)' }}>
      <Header />

      <div className="flex flex-1 justify-center">
        <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-xl mt-8 mb-16">
          <h2 className="text-3xl font-bold text-[#103713] mb-6">Confirm Your Order</h2>

          {/* Order Summary */}
          <div className="order-details mb-6">
            <h3 className="text-xl font-semibold text-[#628b35] mb-4">Order Summary</h3>
            {order.items.map(item => (
              <div key={item.itemId} className="flex justify-between mb-3">
                <p>{item.itemName} × {item.quantity}</p>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="order-total border-t pt-4 mt-4">
              <h3 className="text-xl font-bold text-[#103713]">Total: ${order.totalPrice.toFixed(2)}</h3>
            </div>
          </div>

          {/* Customer Details */}
          <div className="customer-details mb-6">
            <h3 className="text-xl font-semibold text-[#628b35] mb-4">Delivery Information</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {customer.name}</p>
              <p><strong>Email:</strong> {customer.email}</p>
              <p><strong>Address:</strong> {customer.address}</p>
              <p><strong>Phone:</strong> {customer.phone}</p>
            </div>
            <button
              onClick={() => navigate('/customer/profile')}
              className="mt-3 text-blue-500 hover:text-blue-700"
            >
              Update Delivery Information
            </button>
          </div>

          {/* Payment and Cancel buttons */}
          <div className="action-buttons mt-8 flex justify-between">
            <button
              onClick={handlePayment}
              className="py-2 px-6 bg-[#628b35] text-white rounded-lg hover:bg-[#4a6b2a] transition-colors"
            >
              Proceed to Payment
            </button>
            <button
              onClick={handleCancelOrder}
              className="py-2 px-6 border border-[#D9534F] text-[#D9534F] rounded-lg hover:bg-[#F2D1D1] transition-colors"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
