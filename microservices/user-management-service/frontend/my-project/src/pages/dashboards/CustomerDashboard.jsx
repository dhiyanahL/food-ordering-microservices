import React, { useEffect, useState } from 'react';
import { FaStar, FaUtensils, FaClock, FaUser, FaMedal } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', membershipTier: '', loyaltyPoints: 0 });
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch user profile
        const userRes = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({
          name: userRes.data.name,
          membershipTier: userRes.data.membershipTier,
          loyaltyPoints: userRes.data.loyaltyPoints,
        });

        // Fetch average rating
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

  // Render star icons based on rating
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
    <div className="min-h-screen bg-gradient-to-br from-[#103713] to-[#628B35] text-[#103713] p-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-[#F2EBE3] rounded-2xl p-6 shadow-md text-center mb-6">
          <h1 className="text-3xl font-bold font-[Kalnia]">Hi {user.name} 👋</h1>
          <p className="text-xl mt-2 font-semibold text-[#628B35] flex justify-center items-center gap-2">
            <FaMedal className="text-yellow-500" /> {user.membershipTier} Member - {user.loyaltyPoints} pts
          </p>

          {/* Average Rating */}
          <div className="mt-3 flex justify-center items-center gap-2 text-lg text-[#6F4D38]">
            <span>Your Avg Rating:</span> {renderStars(averageRating)}
            <span className="ml-2">({averageRating})</span>
          </div>

          <a href="/track-order" className="block mt-4 text-blue-600 hover:underline font-medium text-xl">
            Track Current Order - ETA 12min 📦
          </a>
        </div>

        {/* Dashboard Sections */}
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

        {/* Bottom Navigation Bar */}
        <div className="flex justify-around items-center bg-[#103713] text-white p-4 rounded-xl shadow-md">
          <button
            onClick={() => navigate('/rate-order')}
            className="flex flex-col items-center text-sm hover:text-yellow-400"
          >
            <FaStar size={20} />
            Rate Order
          </button>
          <button
            onClick={() => navigate('/restaurants')}
            className="flex flex-col items-center text-sm hover:text-yellow-400"
          >
            <FaUtensils size={20} />
            Browse
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="flex flex-col items-center text-sm hover:text-yellow-400"
          >
            <FaClock size={20} />
            Orders
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center text-sm hover:text-yellow-400"
          >
            <FaUser size={20} />
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
