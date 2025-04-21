import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaHeart, FaListAlt, FaStar, FaMedal } from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';
import { MdDateRange, MdAccessTime, MdEmail, MdPhone, MdHome } from 'react-icons/md';

const ViewProfile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/user/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!user) return <p className="text-center mt-10 text-[#103713] font-semibold">Loading...</p>;

  // Format dates
  const createdAt = new Date(user.createdAt).toLocaleDateString();
  const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A';

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex justify-center items-center p-6">
      <div className="bg-[#F2EBE3] shadow-md rounded-2xl p-8 w-full max-w-3xl text-[#103713] border-2 border-green-700">
        
        {/* Profile Icon */}
        <div className="text-center mb-4">
          <BsPersonCircle className="text-[8rem] text-[#628B35] mx-auto" />
        </div>

        {/* Welcome */}
        <h2 className="text-4xl font-bold mb-4 text-center font-[Kalnia]">Hey, {user.name} 👋</h2>

        {/* Points & Tier */}
        <div className="flex justify-center gap-8 text-xl font-semibold mb-6 text-[#103713]">
          <div className="flex items-center gap-2">
            <FaStar className="text-[#FFD700]" /> {/* Gold Color */}
            <span>{user.loyaltyPoints} Points</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMedal className="text-[#FFD700]" /> {/* Gold Color */}
            <span>{user.membershipTier}</span>
          </div>
        </div>

        <hr className="my-4 border-[#628B35]" />

        {/* Profile Info - Side by side */}
        <div className="space-y-3 text-lg  mb-6">
          <div className="flex justify-between">
            <p className="flex items-center gap-2">
              <BsPersonCircle className="text-[#103713]" />
              <strong>Name :</strong> {user.name}
            </p>
            <p className="flex items-center gap-2">
              <MdEmail className="text-[#103713]" />
              <strong>Email Address :</strong> {user.email}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="flex items-center gap-2">
              <MdHome className="text-[#103713]" />
              <strong>Address :</strong> {user.address || 'Not Provided'}
            </p>
            <p className="flex items-center gap-2">
              <MdPhone className="text-[#103713]" />
              <strong>Mobile Number :</strong> {user.phoneNumber}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="flex items-center gap-2">
              <MdDateRange className="text-[#103713]" />
              <strong>Account Created :</strong> {createdAt}
            </p>
            <p className="flex items-center gap-2">
              <MdAccessTime className="text-[#103713]" />
              <strong>Last Login :</strong> {lastLogin}
            </p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-8 font-[Kalnia]">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <FaListAlt className="text-3xl text-[#103713] mx-auto mb-2" />
            <p className="text-lg font-semibold">Total Orders</p>
            <p className="text-2xl text-[#628B35]">--</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <FaHeart className="text-3xl text-red-500 mx-auto mb-2" />
            <p className="text-lg font-semibold">Favorites</p>
            <p className="text-2xl text-[#628B35]">--</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
            <p className="text-lg font-semibold">Avg Rating</p>
            <p className="text-2xl text-[#628B35]">--</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/edit')}
            className="flex items-center gap-2 bg-[#103713] text-white py-2 px-4 rounded-xl hover:bg-[#0d2f10] font-[Kalnia]"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => navigate('/delete')}
            className="flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 font-[Kalnia]"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
