import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaHeart, FaListAlt, FaStar, FaMedal, FaSignInAlt } from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';
import { MdDateRange, MdAccessTime, MdEmail, MdPhone, MdHome } from 'react-icons/md';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

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

  const createdAt = new Date(user.createdAt).toLocaleDateString();
  const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A';

  return (
    <div className="min-h-screen flex flex-col">
      <Header toggleSidebar={() => {}} />

      <main
        className="flex-grow flex justify-center items-center p-6"
        style={{
          backgroundImage: `url('/images/bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="bg-[#FFFDF5] shadow-md rounded-2xl p-8 w-full max-w-3xl text-[#103713] border-2 border-green-700">
          <div className="text-center mb-4">
            <BsPersonCircle className="text-[8rem] text-[#628B35] mx-auto" />
          </div>

          <h2 className="text-4xl font-bold mb-4 text-center font-[Kalnia]">Hey, {user.name} 👋</h2>

          <div className="flex justify-center gap-8 text-xl font-semibold mb-6 text-[#103713]">
            <div className="flex items-center gap-2">
              <FaStar className="text-[#FFD700]" />
              <span>{user.loyaltyPoints} Points</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMedal className="text-[#FFD700]" />
              <span>{user.membershipTier}</span>
            </div>
          </div>

          <hr className="my-4 border-[#628B35]" />

          <div className="space-y-3 text-lg mb-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-8 font-[Kalnia]">
            <div className="bg-[#648e37] rounded-xl p-4 shadow-md border-2 border-darkGreen border-700">
              <FaMedal className="text-3xl text-[#ebcc1f] mx-auto mb-2" />
              <p className="text-lg text-softBeige font-semibold">Membership Tier</p>
              <p className="text-2xl text-darkGreen">{user.membershipTier}</p>
            </div>
            <div className="bg-[#648e37] rounded-xl p-4 shadow-md border-2 border-darkGreen border-700">
              <FaSignInAlt className="text-3xl text-red-500 mx-auto mb-2" />
              <p className="text-lg text-softBeige font-semibold">Login Count</p>
              <p className="text-2xl text-darkGreen">{user.loginCount}</p>
            </div>
            <div className="bg-[#648e37] rounded-xl p-4 shadow-md border-2 border-darkGreen border-700">
              <FaStar className="text-3xl text-yellow-500 mx-auto mb-2" />
              <p className="text-lg text-softBeige font-semibold">Avg Rating</p>
              <p className="text-2xl text-darkGreen">{user.averageRatingGiven.toFixed(1)}</p>
            </div>
          </div>

          <div className="flex justify-center gap-x-4">
            <button
              onClick={() => navigate('/edit')}
              className="flex items-center gap-2 bg-[#103713] text-white py-2 px-4 rounded-xl hover:bg-[#0d2f10] font-[Kalnia] border-2 border-yellow-500 border-700"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => navigate('/delete')}
              className="flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 font-[Kalnia] border-2 border-black border-700"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>
        
      </main>

      <Footer />
    </div>
  );
};

export default ViewProfile;
