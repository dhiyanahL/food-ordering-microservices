import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

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
        const customerId = localStorage.getItem('userId');
        if (!customerId) throw new Error('Please log in to view your orders');

        const response = await axios.get(`/api/orders/history?customerId=${customerId}`);
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Canceled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Sent to Deliver': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={userRole} isOpen={sidebarOpen} />
        <main className={`flex-grow transition-all duration-300 ${sidebarOpen ? 'ml-56' : 'ml-0'}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Order History</h2>

              {loading ? (
                <div className="text-center text-gray-500">Loading your orders...</div>
              ) : error ? (
                <div className="text-center text-red-500">
                  {error}
                  <button onClick={() => window.location.reload()} className="ml-4 bg-blue-600 text-white px-4 py-2 rounded">
                    Try Again
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <button
                    onClick={() => navigate('/customer/restaurants')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                  >
                    Browse Restaurants
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition cursor-pointer"
                      onClick={() => handleOrderClick(order._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg text-green-700">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">Placed on: {formatDate(order.createdAt)}</p>
                          {order.restaurantName && (
                            <p className="text-sm text-gray-600 mt-1">Restaurant: {order.restaurantName}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">${order.totalPrice.toFixed(2)}</p>
                          <span className={`mt-1 inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-3">
                        <h4 className="font-medium text-gray-900 mb-1">Items:</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>{item.quantity} × {item.itemName}</span>
                              <span>${(item.quantity * item.price).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
