import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import Map from '../components/Map'; // Assume a Map component (e.g., Google Maps)

const DeliveryTrackerPage = ({ orderId }) => {
  const [delivery, setDelivery] = useState(null);
  const [driver, setDriver] = useState(null);
  const [eta, setEta] = useState('Calculating...');

  useEffect(() => {
    // Fetch delivery details
    const fetchDelivery = async () => {
      const res = await axios.get(`http://delivery-service/api/deliveries/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      setDelivery(res.data.delivery);

      // Fetch driver details
      const driverRes = await axios.get(`http://user-service/api/drivers/${res.data.delivery.driverId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      });
      setDriver(driverRes.data);

      // Calculate ETA
      const distance = calculateDistance(
        res.data.delivery.restaurantLocation,
        res.data.delivery.customerLocation
      );
      setEta(`${Math.round(distance * 10)} minutes`);
    };
    fetchDelivery();

    // Real-time tracking with Socket.IO
    const socket = io('http://delivery-service');
    socket.emit('joinDeliveryRoom', orderId);
    socket.on('locationUpdate', (coords) => {
      setDelivery(prev => ({ ...prev, currentDriverLocation: coords }));
    });

    return () => socket.disconnect();
  }, [orderId]);

  if (!delivery || !driver) return <div className="loading">Loading...</div>;

  return (
    <div className="page-container" style={{ backgroundImage: 'url(/path/to/background.jpg)' }}>
      <div className="tracker-container" style={{ backgroundColor: '#FFFDF5' }}>
        <h2 style={{ color: '#103713' }}>Track Your Order</h2>
        
        <div className="map-container">
          <Map 
            restaurant={delivery.restaurantLocation}
            customer={delivery.customerLocation}
            driver={delivery.currentDriverLocation}
          />
        </div>

        <div className="delivery-details">
          <h3 style={{ color: '#628b35' }}>Delivery Status: {delivery.status}</h3>
          <div className="driver-info">
            <img src={driver.avatar} alt="Driver" />
            <p>{driver.name}</p>
            <p>ETA: {eta}</p>
          </div>
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ 
                width: `${getProgressPercentage(delivery.status)}%`,
                backgroundColor: '#628b35'
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const calculateDistance = (loc1, loc2) => { /* ... */ };
const getProgressPercentage = (status) => {
  const statusOrder = ['Assigned', 'Picked-up', 'On the way', 'Delivered'];
  return (statusOrder.indexOf(status) + 1) * 25;
};

export default DeliveryTrackerPage;