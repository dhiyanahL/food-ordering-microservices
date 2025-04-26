import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Get order summary
      const orderRes = await axios.get('http://order-service/api/cart', {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      setOrder(orderRes.data.cart);

      // Get customer details
      const customerRes = await axios.get('http://user-service/api/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      setCustomer(customerRes.data);
    };
    fetchData();
  }, []);

  const handlePayment = async () => {
    const res = await axios.post('http://order-service/api/cart/checkout', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    });
    window.location.href = res.data.paymentLink; // Redirect to payment gateway
  };

  if (!order || !customer) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container" style={{ backgroundImage: 'url(/path/to/background.jpg)' }}>
      <div className="checkout-container" style={{ backgroundColor: '#FFFDF5' }}>
        <h2 style={{ color: '#103713' }}>Confirm Your Order</h2>
        
        <div className="order-details">
          <h3 style={{ color: '#628b35' }}>Order Summary</h3>
          {order.items.map(item => (
            <div key={item.itemId} className="order-item">
              <p>{item.itemName} × {item.quantity}</p>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="order-total" style={{ borderTop: '2px solid #E2DBD0' }}>
            <h3>Total: ${order.totalPrice.toFixed(2)}</h3>
          </div>
        </div>

        <div className="customer-details">
          <h3 style={{ color: '#628b35' }}>Delivery Information</h3>
          <p>{customer.name}</p>
          <p>{customer.address}</p>
          <p>{customer.phone}</p>
        </div>

        <button 
          onClick={handlePayment}
          style={{ backgroundColor: '#628b35', color: '#FFFDF5' }}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;