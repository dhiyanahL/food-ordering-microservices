import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa';
import { BsPersonCircle } from 'react-icons/bs';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { toast } from "react-toastify";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    newPassword: '',
  });

  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/user/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      const { name, email, phoneNumber, address } = res.data; 
      setFormData(prev => ({
        ...prev,
        name,
        email,
        phoneNumber: phoneNumber || '',
        address: address || '',
      }));
    })
    .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword && formData.newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      await axios.put('http://localhost:5000/api/user/edit', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success("Profile Edited successful!");
      navigate('/profile');
    } catch (err) {
      toast.error("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex" style={{
      backgroundImage: `url('/images/bg.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <Sidebar role="Customer" isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-2 flex-1 flex justify-center items-center">
          <form onSubmit={handleSubmit} className="bg-[#FFFDF5] shadow-md rounded-2xl p-8 w-full max-w-3xl text-[#103713] border-2 border-green-700">
            {/* Profile Icon at the top */}
            <div className="text-center mb-6">
              <BsPersonCircle className="text-9xl text-[#628B35] mx-auto" />
            </div>

            <h2 className="text-4xl font-bold mb-6 text-center font-[Kalnia]">Edit Profile</h2>

            {/* First Row - Name & Email */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full relative">
                <label className="block text-xl mb-2 text-oliveGreen font-bold font-[Kalnia]">Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  className="w-full p-2 rounded border mb-5 focus:outline-none focus:border-[#103713]" 
                />
                <FaUserEdit className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#103713]"style={{ top: '55%' }} />
              </div>
              <div className="w-full relative">
                <label className="block text-xl mb-2 text-oliveGreen font-bold font-[Kalnia]">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  className="w-full p-2 rounded border mb-5 focus:outline-none focus:border-[#103713]" 
                />
                <FaUserEdit className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#103713]" style={{ top: '55%' }} />
              </div>
            </div>

            {/* Second Row - Phone Number & Address */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full relative">
                <label className="block text-xl mb-2 text-oliveGreen font-bold font-[Kalnia]">Phone Number</label>
                <input 
                  type="text" 
                  name="phoneNumber" 
                  value={formData.phoneNumber} 
                  onChange={handleChange}
                  className="w-full p-2 rounded border mb-5 focus:outline-none focus:border-[#103713]" 
                />
                <FaUserEdit className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#103713]" style={{ top: '55%' }} />
              </div>
              <div className="w-full relative">
                <label className="block text-xl mb-2 text-oliveGreen font-bold font-[Kalnia]">Address</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                  className="w-full p-2 rounded border mb-5 focus:outline-none focus:border-[#103713]" 
                />
                <FaUserEdit className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#103713]" style={{ top: '55%' }}/>
              </div>
            </div>

            {/* Third Row - New Password & Confirm New Password */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full relative">
                <label className="block text-xl mb-2 text-oliveGreen font-bold font-[Kalnia]">New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={formData.newPassword} 
                  onChange={handleChange}
                  className="w-full p-2 rounded border mb-5 focus:outline-none focus:border-[#103713]" 
                />
                <FaUserEdit className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#103713]" style={{ top: '55%' }}/>
              </div>
              <div className="w-full relative">
                <label className="block text-xl mb-2 text-oliveGreen font-bold font-[Kalnia]">Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmNewPassword" 
                  value={confirmNewPassword} 
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full p-2 rounded border mb-5 focus:outline-none focus:border-[#103713]" 
                />
                <FaUserEdit className="absolute top-1/2 right-3 transform -translate-y-1/2 text-[#103713]" style={{ top: '55%' }} />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <button 
              type="submit" 
              className="w-full bg-darkGreen text-white py-3 mt-2 rounded-xl hover:bg-oliveGreen transition text-lg font-[Kalnia] border-2 border-oliveGreen"
            >
              Save Changes
            </button>
          </form>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default EditProfile;