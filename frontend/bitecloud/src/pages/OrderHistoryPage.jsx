import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from "../components/Sidebar";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start with sidebar closed
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role') || 'Customer';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://order-service/api/orders/history/all', {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
        });
        setOrders(res.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-fixed" 
         style={{ backgroundImage: 'url(/images/bg.png)' }}>
      {/* Header with toggle function */}
      <Header toggleSidebar={toggleSidebar} />
      
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar role={userRole} isOpen={sidebarOpen} />
        
        {/* Content Area */}
        <div className={`flex-grow transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'ml-56' : 'ml-0'
        }`}>
          <div className="container mx-auto px-4 py-8">
            <div className="bg-[#FFFDF5] rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#103713' }}>Your Orders</h2>
              
              {orders.length === 0 ? (
                <p className="text-center py-8">No orders yet</p>
              ) : (
                <div className="grid gap-4">
                  {orders.map(order => (
                    <div 
                      key={order._id}
                      className="p-4 rounded-lg cursor-pointer transition-all hover:shadow-md"
                      style={{ 
                        border: '1px solid #E2DBD0',
                        backgroundColor: 'rgba(255, 253, 245, 0.9)'
                      }}
                      onClick={() => navigate(`/track/${order._id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold" style={{ color: '#628b35' }}>
                            Order #{order._id.slice(-6)}
                          </h3>
                          <p className="text-sm">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.totalPrice.toFixed(2)}</p>
                          <p 
                            className={`text-sm ${
                              order.status === 'Delivered' ? 'text-green-600' : 
                              order.status === 'Canceled' ? 'text-red-600' : 'text-blue-600'
                            }`}
                          >
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OrderHistoryPage;
