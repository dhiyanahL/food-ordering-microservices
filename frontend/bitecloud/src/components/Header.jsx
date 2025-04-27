import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaShoppingCart, FaBell, FaBars, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate(); 
  return (
    <header className="bg-darkGreen text-[#FFFDF5] flex items-center justify-between p-3 shadow-lg font-[Kalnia]">
      {/* Left side: Sidebar toggle + logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-[#355E3B] text-[#FFFDF5] rounded-full hover:bg-[#4C8050] focus:outline-none"
        >
          <FaBars size={22} />
        </button>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#40ff00] via-lime-500 to-green-800 bg-clip-text text-transparent font-kalnia">
            BiteCloud
          </h1>
          <p className="text-xl text-softBeige">
            Bringing Delicious to Your Doorstep!🍴
          </p>
        </div>
      </div>

      {/* Right side: Icons */}
      <div className="flex items-center gap-6 text-2xl">
      <FaHome
          className="cursor-pointer hover:text-[#FFD700]"
          onClick={() => navigate("/customer/dashboard")} //Change according to role
        />

        {/* Notifications icon with redirect to notifications page */}
        <FaBell
          className="cursor-pointer hover:text-[#FFD700]"
          onClick={() => navigate("/notification/viewNotification")}
        />

        {/* Cart icon */}
        <FaShoppingCart className="cursor-pointer hover:text-[#FFD700]"
        onClick={() => navigate("/cart")}
         />

        {/* Profile icon with redirect to view profile page */}
        <BsPersonCircle
          className="cursor-pointer hover:text-[#FFD700]"
          onClick={() => navigate("/profile")}
        />
      </div>
    </header>
  );
};

export default Header;