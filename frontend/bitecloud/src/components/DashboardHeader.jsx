import React, { useState, useEffect } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaShoppingCart, FaBell, FaBars, FaHome } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const DashboardHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const token = localStorage.getItem("token");

  // Auto-fetch notifications depending on the page (RestaurantAdmin or RestaurantDetail)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let res;
  
        if (location.pathname.startsWith("/restaurant/dashboard/")) {
          // Restaurant Detail Dashboard
          const restaurantId = location.pathname.split("/")[3];
          res = await axios.get(`http://localhost:5400/restaurant-notifications/${restaurantId}`);
        } else if (location.pathname === "/restaurant/dashboard") {
          // Restaurant Admin Dashboard (list of your restaurants)
          const myRestaurants = await axios.get("http://localhost:5400/restaurants/my", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          const notificationRequests = myRestaurants.data.map((r) =>
            axios.get(`http://localhost:5400/restaurant-notifications/${r._id}`)
          );
  
          const responses = await Promise.all(notificationRequests);
          const allNotifications = responses.flatMap((r) => r.data);
          setNotifications(allNotifications);
          return;
        } else if (location.pathname.startsWith("/admin")) {
          // Admin Dashboard: FETCH ADMIN NOTIFICATIONS
          res = await axios.get("http://localhost:5100/admin/notifications");
        } else {
          // Not on dashboard pages
          setNotifications([]);
          return;
        }
  
        if (res) {
          setNotifications(res.data);
        }
      } catch (err) {
        console.error("❌ Error loading notifications:", err);
      }
    };
  
    fetchNotifications();
  }, [location.pathname]);
  

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:5400/restaurant-notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  return (
    <header className="bg-darkGreen text-[#FFFDF5] flex items-center justify-between p-4 shadow-lg relative">
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
      <div className="flex items-center gap-6 text-2xl relative">
        <FaHome
          className="cursor-pointer hover:text-[#FFD700]"
          onClick={() => navigate("/customer/dashboard")} // (you can change according to role later)
        />

        {/* Bell icon for Notifications */}
        <div className="relative">
          <FaBell
            className="cursor-pointer hover:text-[#FFD700]"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-softBeige border rounded shadow p-4 z-10 max-h-72 overflow-y-auto">
              <h2 className="text-lg font-semibold text-darkGreen mb-2">
                Notifications
              </h2>
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No new notifications</p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((note) => (
                    <div
                      key={note._id}
                      className={`relative flex justify-between items-center p-3 rounded text-sm shadow-sm
                      ${
                        note.type === "success"
                          ? "bg-green-100 text-green-800"
                          : note.type === "error"
                          ? "bg-red-100 text-red-800"
                          : note.type === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <span>{note.message}</span>
                      <button onClick={() => deleteNotification(note._id)} className="ml-2 text-darkGreen hover:text-black">
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cart and Profile icons */}
        <FaShoppingCart
          className="cursor-pointer hover:text-[#FFD700]"
          onClick={() => navigate("/cart")}
        />

        <BsPersonCircle
          className="cursor-pointer hover:text-[#FFD700]"
          onClick={() => navigate("/profile")}
        />
      </div>
    </header>
  );
};

export default DashboardHeader;
