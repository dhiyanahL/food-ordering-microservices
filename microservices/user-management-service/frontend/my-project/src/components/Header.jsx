import React from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { FaShoppingCart, FaBell, FaBars } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-darkGreen text-[#FFFDF5] flex items-center justify-between p-4 shadow-lg font-[Kalnia]">
      {/* Left side: Sidebar toggle + logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-[#355E3B] text-[#FFFDF5] rounded-full hover:bg-[#4C8050] focus:outline-none"
        >
          <FaBars size={22} />
        </button>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#40ff00] via-lime-500 to-green-800 bg-clip-text text-transparent font-kalnia">BiteCloud</h1>
          <p className="text-xl text-softBeige">Bringing Delicious to Your Doorstep!🍴</p>
        </div>
      </div>

      {/* Right side: Icons */}
      <div className="flex items-center gap-6 text-2xl">
        <FaBell className="cursor-pointer hover:text-[#FFD700]" />
        <FaShoppingCart className="cursor-pointer hover:text-[#FFD700]" />
        <div className="relative group">
          <BsPersonCircle className="cursor-pointer hover:text-[#FFD700]" />
          <div className="absolute right-0 mt-2 w-40 bg-white text-[#103713] rounded-xl shadow-lg hidden group-hover:block">
            <button className="block w-full text-left px-4 py-2 hover:bg-[#F2EBE3]">View Profile</button>
            <button className="block w-full text-left px-4 py-2 hover:bg-[#F2EBE3]">Edit Profile</button>
            <button className="block w-full text-left px-4 py-2 hover:bg-[#F2EBE3] text-red-600">Delete Profile</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
