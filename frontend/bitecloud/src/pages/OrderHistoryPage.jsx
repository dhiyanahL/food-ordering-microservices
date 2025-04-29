import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from "../components/Sidebar";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role') || 'Customer';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const customerId = localStorage.getItem('userId');
        
        if (!customerId) {
          throw new Error('Please login to view your orders');
        }

        const response = await axios.get(`/api/orders/history`, {
          params: { customerId },
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data && Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.response?.data?.message || error.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-red-600">
          Error: {error}
          <button 
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={userRole} isOpen={sidebarOpen} />
        
        <div className={`flex-grow transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-56' : 'ml-0'
        }`}>
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Order History</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">
                    You haven't placed any orders yet
                  </div>
                  <button 
                    onClick={() => navigate('/customer/restaurants')}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div 
                      key={order._id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleOrderClick(order._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-green-700">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Placed on: {new Date(order.createdAt).toLocaleString()}
                          </p>
                          {order.restaurantName && (
                            <p className="text-sm text-gray-600 mt-1">
                              Restaurant: {order.restaurantName}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            ${order.totalPrice?.toFixed(2) || '0.00'}
                          </p>
                          <p className={`text-sm ${
                            order.status === 'Delivered' ? 'text-green-600' : 
                            order.status === 'Canceled' ? 'text-red-600' : 
                            'text-blue-600'
                          }`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
