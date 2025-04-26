import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Map from '../components/Map'; // Google Maps/Mapbox component

const DriverDashboard = () => {
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch available drivers and pending orders
  useEffect(() => {
    const fetchData = async () => {
      const driversRes = await axios.get('http://user-service/api/drivers?available=true');
      const ordersRes = await axios.get('http://order-service/api/orders?status=Pending');
      setDrivers(driversRes.data);
      setOrders(ordersRes.data);
    };
    fetchData();

    // Real-time driver locations
    const socket = io('http://delivery-service');
    socket.on('driverLocation', (data) => {
      setDrivers(prev => prev.map(d => 
        d._id === data.driverId ? { ...d, location: data.coords } : d
      ));
    });
    return () => socket.disconnect();
  }, []);

  // Assign closest driver to order
  const assignDriver = async (orderId) => {
    const order = orders.find(o => o._id === orderId);
    const res = await axios.post(
      'http://delivery-service/api/assign',
      { orderId, restaurantLocation: order.restaurantLocation },
      { headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    });
    setOrders(orders.filter(o => o._id !== orderId));
  };

  return (
    <div className="dashboard" style={{ background: '#FFFDF5' }}>
      <h2 style={{ color: '#103713' }}>Driver Management</h2>
      
      <div className="map-container">
        <Map 
          drivers={drivers} 
          restaurants={orders.map(o => o.restaurantLocation)}
          onSelectOrder={setSelectedOrder}
        />
      </div>

      <div className="order-list">
        <h3 style={{ color: '#628b35' }}>Pending Orders</h3>
        {orders.map(order => (
          <div key={order._id} className="order-card" style={{ border: '1px solid #E2DBD0' }}>
            <p>Order #{order._id.slice(-6)}</p>
            <p>Restaurant: {order.restaurantName}</p>
            <button 
              onClick={() => assignDriver(order._id)}
              style={{ backgroundColor: '#628b35', color: '#FFFDF5' }}
            >
              Assign Closest Driver
            </button>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div className="order-details" style={{ backgroundColor: '#E2DBD0' }}>
          <h3>Order Details</h3>
          <p>Customer: {selectedOrder.customerName}</p>
          <p>Total: ${selectedOrder.totalPrice.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;