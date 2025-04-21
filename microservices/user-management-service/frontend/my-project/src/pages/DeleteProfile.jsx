import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteProfile = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete('/api/users/delete', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      localStorage.removeItem('token'); // Clear token on logout
      alert('Your account has been deleted.');
      navigate('/register'); // Redirect to home or login
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] flex justify-center items-center p-6">
      <div className="bg-[#F2EBE3] shadow-md rounded-2xl p-8 w-full max-w-md text-[#103713] text-center">
        <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
        <p className="mb-6 text-[#628B35]">
          Are you sure you want to delete your profile? This action is <strong>permanent</strong> and cannot be undone.
        </p>

        <div className="flex justify-between gap-4">
          <button
            onClick={() => navigate('/view-profile')}
            className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 w-full"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 w-full"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfile;
