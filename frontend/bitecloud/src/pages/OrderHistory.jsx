import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get('http://order-service/api/orders/history/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      setOrders(res.data.orders);
    };
    fetchOrders();
  }, []);

  return (
    <div className="page-container" style={{ backgroundImage: 'url(/path/to/background.jpg)' }}>
      <div className="history-container" style={{ backgroundColor: '#FFFDF5' }}>
        <h2 style={{ color: '#103713' }}>Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <div className="order-list">
            {orders.map(order => (
              <div 
                key={order._id} 
                className="order-card" 
                style={{ border: '1px solid #E2DBD0' }}
                onClick={() => navigate(`/track/${order._id}`)}
              >
                <h3 style={{ color: '#628b35' }}>Order #{order._id.slice(-6)}</h3>
                <p>Status: {order.status}</p>
                <p>Total: ${order.totalPrice.toFixed(2)}</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;