import React from 'react';
import { FaHome, FaUtensils, FaListAlt, FaTags, FaUserAlt, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ role, isOpen }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Optional: Call backend logout route (not necessary for JWT, but you can keep it structured)
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Remove token and role from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      // Redirect to login
      navigate("/");
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const navItems = {
    Customer: [
      { name: 'Dashboard', icon: FaHome, path: '/customer/dashboard' },
      { name: 'Restaurants', icon: FaUtensils, path: '/customer/restaurants' },
      { name: 'Orders', icon: FaListAlt, path: '/customer/orders' },
      { name: 'Offers', icon: FaTags, path: '/customer/offers' },
      { name: 'Profile', icon: FaUserAlt, path: '/profile' },
      { name: 'Logout', icon: FaSignOutAlt, path: null, onClick: handleLogout },
    ],
    Admin: [
      { name: 'Dashboard', icon: FaHome, path: '/admin/dashboard' },
      { name: 'Offers', icon: FaTags, path: '/admin/available-offers' },
      { name: 'Logout', icon: FaSignOutAlt, path: null, onClick: handleLogout },
    ],
  };

  return (
    <aside
      className={`bg-gradient-to-br from-emerald-700 via-lime-600 to-green-800 text-[#103713] h-screen flex flex-col border-r-4 border-[#053002] shadow-lg
        ${isOpen ? 'w-56' : 'w-0'}  overflow-hidden transition-all duration-300`}
    >
      <nav className={`flex-1 p-4 mt-16 ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="space-y-14">
          {navItems[role].map(item => (
            <li key={item.name}>
              {item.path ? (
                <Link
                  to={item.path}
                  className="flex items-center justify-center p-4 bg-[#FFFDF5] text-[#103713] border-2 border-[#103713] rounded-xl text-base font-semibold tracking-wide shadow-md hover:bg-[#F2EBE3] hover:scale-105 transition-transform duration-300 font-[Kalnia]"
                >
                  <item.icon className="mr-2" /> {item.name}
                </Link>
              ) : (
                <button
                  onClick={item.onClick}
                  className="flex w-full items-center justify-center p-4 bg-[#FFFDF5] text-[#103713] border-2 border-[#103713] rounded-xl text-base font-semibold tracking-wide shadow-md hover:bg-[#F2EBE3] hover:scale-105 transition-transform duration-300 font-[Kalnia]"
                >
                  <item.icon className="mr-2" /> {item.name}
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;