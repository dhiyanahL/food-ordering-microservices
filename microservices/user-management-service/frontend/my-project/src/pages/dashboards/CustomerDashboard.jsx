import React, { useEffect, useState } from 'react';
import { FaStar, FaMedal } from 'react-icons/fa';
import axios from 'axios';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';

const CustomerDashboard = () => {
  const [user, setUser] = useState({ name: '', membershipTier: '', loyaltyPoints: 0 });
  const [averageRating, setAverageRating] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true); // <-- Sidebar toggle state

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        const userRes = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          name: userRes.data.name,
          membershipTier: userRes.data.membershipTier,
          loyaltyPoints: userRes.data.loyaltyPoints,
        });

        const ratingRes = await axios.get('http://localhost:5000/api/user/average-rating', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAverageRating(ratingRes.data.averageRating.toFixed(1));
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserDetails();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={i} className="text-yellow-500 inline" />
        ))}
        {halfStar && <FaStar className="text-yellow-300 inline" />}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
          <FaStar key={i} className="text-gray-300 inline" />
        ))}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#103713] to-[#628B35] text-[#103713] font-sans">

      {/* Sidebar */}
      <Sidebar role="Customer" isOpen={sidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dashboard Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#F2EBE3] rounded-2xl p-6 shadow-md text-center mb-6">
              <h1 className="text-3xl font-bold font-[Kalnia]">Hi {user.name} 👋</h1>
              <p className="text-xl mt-2 font-semibold text-[#628B35] flex justify-center items-center gap-2">
                <FaMedal className="text-yellow-500" /> {user.membershipTier} Member - {user.loyaltyPoints} pts
              </p>

              <div className="mt-3 flex justify-center items-center gap-2 text-lg text-[#6F4D38]">
                <span>Your Avg Rating:</span> {renderStars(averageRating)}
                <span className="ml-2">({averageRating})</span>
              </div>

              <a href="/track-order" className="block mt-4 text-blue-600 hover:underline font-medium text-xl">
                Track Current Order - ETA 12min 📦
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow">
                <h2 className="font-bold text-xl mb-2">📋 Recent Orders</h2>
                <p>🍕 PizzaHut [OrderAgain]</p>
                <p>🍔 McD [OrderAgain]</p>
              </div>

              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow">
                <h2 className="font-bold text-xl mb-2">⭐ Recommended</h2>
                <p>🥡 Asian Bowl</p>
                <p>🥗 GreenLeaf Café</p>
              </div>

              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow">
                <h2 className="font-bold text-xl mb-2">🎁 Offers & Rewards</h2>
                <p>Get 25% off on orders!</p>
              </div>

              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow">
                <h2 className="font-bold text-xl mb-2">💰 Wallet</h2>
                <p>Rs. 1,200</p>
                <p className="text-sm text-blue-700">[Add Money] [View Txns]</p>
              </div>

              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow">
                <h2 className="font-bold text-xl mb-2">❤️ Your Favourites</h2>
                <p>🍣 Sushi Bar</p>
              </div>

              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow">
                <h2 className="font-bold text-xl mb-2">🔥 Trending Nearby</h2>
                <p>🍛 Curry House</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default CustomerDashboard;
