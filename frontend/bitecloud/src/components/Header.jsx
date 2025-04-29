import React, { useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaShoppingCart, FaBell, FaBars, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationComponent from "../pages/NotificationComponent";

const Header = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
  };

  return (
    <header className="bg-darkGreen text-[#FFFDF5] flex items-center justify-between p-3 shadow-lg font-[Kalnia]">
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

      <div className="flex items-center gap-6 text-2xl relative">
        <FaHome
          className="cursor-pointer hover:text-[#FFD700]"
          onClick={() => navigate("/customer/dashboard")}
        />

        <div className="relative cursor-pointer" onClick={handleNotificationClick}>
          <FaBell className="hover:text-[#FFD700]" />
          {unseenCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unseenCount}
            </span>
          )}
        </div>

        <FaShoppingCart
          className="cursor-pointer hover:text-[#FFD700]"
          onClick={() => navigate("/cart")}
        />
        <BsPersonCircle
          className="cursor-pointer hover:text-[#FFD700]"
          onClick={() => navigate("/profile")}
        />
      </div>

      {showNotifications && (
        <div className="absolute top-16 right-4 z-20">
          <NotificationComponent onUnseenCountChange={setUnseenCount} />
        </div>
      )}
    </header>
  );
};

export default Header;
