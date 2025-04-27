import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";

export default function RestaurantDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    openTime: "",
    closeTime: "",
    cuisineType: "",
    contactNumber: "",
    email: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔄 Fetch user's restaurants
  const fetchMyRestaurants = () => {
    axios
      .get("http://localhost:5400/restaurants/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRestaurants(res.data))
      .catch((err) => console.error("❌ Error fetching restaurants:", err));
  };

  //const [notifications, setNotifications] = useState([]);
  //const [showNotifications, setShowNotifications] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5400/restaurants/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRestaurants(res.data);
{/*
        // After restaurants are loaded, fetch their notifications
        const notificationRequests = res.data.map((r) =>
          axios.get(`http://localhost:5400/restaurant-notifications/${r._id}`)
        );

        Promise.all(notificationRequests)
          .then((responses) => {
            const allNotifications = responses.flatMap((r) => r.data);
            setNotifications(allNotifications);
          })
          .catch((err) =>
            console.error("❌ Error fetching notifications:", err)
          ); */}
      }) 
      .catch((err) => console.error("❌ Error fetching restaurants:", err));
  });

  // 🖊️ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle restaurant registration
  const handleRegister = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    if (!/^\d{2}:\d{2}$/.test(formData.openTime))
      newErrors.openTime = "Invalid open time (e.g. 10:00)";
    if (!/^\d{2}:\d{2}$/.test(formData.closeTime))
      newErrors.closeTime = "Invalid close time (e.g. 22:00)";
    if (!formData.cuisineType)
      newErrors.cuisineType = "Please select a cuisine.";
    if (!/^\d{10}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Enter a 10-digit phone number.";
    if (!/^.+@.+\..+$/.test(formData.email))
      newErrors.email = "Enter a valid email.";
    if (!formData.imageUrl.trim())
      newErrors.imageUrl = "Image URL is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...formData,
      cuisineType: [formData.cuisineType],
    };

    axios
      .post("http://localhost:5400/restaurants", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("✅ Restaurant Registered!");
        setFormData({
          name: "",
          address: "",
          openTime: "",
          closeTime: "",
          cuisineType: "",
          contactNumber: "",
          email: "",
          imageUrl: "",
        });
        setErrors({});
        fetchMyRestaurants();
      })
      .catch((err) => {
        const msg =
          err.response?.data?.message || err.message || "Unknown error";
        alert("❌ Registration Failed: " + msg);
      });
  };

  {/*const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5400/restaurant-notifications/${id}`
      );
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  }; */}

  return (
    <div
    className="min-h-screen bg-repeat bg-center bg-fixed"
    style={{
      backgroundImage: `url('/bg.jpg')`,
      backgroundSize: "cover",
      backgroundRepeat: "repeat",
      backgroundPosition: "top center",
    }}
  > 
  {/* Header */}
  <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

  {/* Sidebar + Main Content */}
  <div className="flex flex-1">
    <Sidebar role="RestaurantAdmin" isOpen={sidebarOpen} />

    {/* Inner content wrapper with padding all around */}
    <div className="w-[75%] mx-auto bg-lightGreen/85 shadow-xl rounded-2xl p-8">
      {/*<div className="p-8 bg-offWhite min-h-screen font-sans">*/}
      <h1 className="text-4xl font-bold text-darkGreen font-kalnia mb-4 text-center">
        Restaurant Owner Dashboard
      </h1>

      {/* 🔔 Notifications Section */}
     {/* <div className="mb-6 relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative bg-softBeige border rounded-full p-2 shadow hover:bg-gray-100"
        >
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {notifications.length}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-darkGreen"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 00-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {showNotifications && notifications.length > 0 && (
          <div className="absolute mt-2 w-full max-w-md bg-softBeige border rounded shadow p-4 z-10">
            <h2 className="text-lg font-semibold text-darkGreen mb-2">
              Notifications
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.map((note) => (
                <div
                  key={note._id}
                  className={`relative flex justify-between items-center p-3 rounded text-sm
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
                  <button onClick={() => deleteNotification(note._id)}>
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div> */}

      {/* 🔽 Dropdown + View Dashboard */}
      <div className="mb-4">
        <label className="block text-xl font-kalnia font-semibold mb-2 text-darkGreen">
          Manage Restaurant
        </label>
        <div className="flex gap-4 items-center">
          <select
            className="w-full p-2 rounded border border-oliveGreen bg-softBeige text-darkGreen shadow focus:outline-none focus:ring-2 focus:ring-oliveGreen"
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
          >
            <option value="">Select a restaurant...</option>
            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>

          {selectedRestaurant && (
            <button
              className="bg-darkGreen text-white px-4 py-2 rounded shadow hover:bg-oliveGreen text-s font-semibold"
              onClick={() =>
                navigate(`/restaurant/dashboard/${selectedRestaurant}`)
              }
            >
              View Dashboard
            </button>
          )}
        </div>
      </div>

      {/* 🟩 Register New Restaurant Form */}
      <div className="bg-softBeige p-6 rounded-xl shadow border-4 border-oliveGreen">
        <h2 className="text-xl font-kalnia font-semibold text-darkGreen mb-4">
          Register New Restaurant
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {["name", "address", "contactNumber", "email"].map((field) => (
            <div key={field}>
              <input
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 rounded border"
              />
              {errors[field] && (
                <p className="text-red-500 text-sm">{errors[field]}</p>
              )}
            </div>
          ))}

          {/* ✅ Image Upload With Live Preview */}
          <div>
            <label className="block text-sm font-medium text-darkGreen mb-1">
              Restaurant Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = await uploadToCloudinary(file);
                  setFormData({ ...formData, imageUrl: url });
                }
              }}
              className="w-full p-2 border rounded"
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm">{errors.imageUrl}</p>
            )}

            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="h-[200px] w-[300px] object-cover rounded-xl mt-2"
              />
            )}
          </div>

          {/* Time Fields */}
          <div className="flex gap-4">
            {["openTime", "closeTime"].map((field) => (
              <div key={field} className="w-full">
                <input
                  name={field}
                  placeholder={
                    field === "openTime"
                      ? "Open Time (e.g. 10:00)"
                      : "Close Time (e.g. 22:00)"
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 rounded border"
                />
                {errors[field] && (
                  <p className="text-red-500 text-sm">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Cuisine Dropdown */}
          <div>
            <select
              name="cuisineType"
              value={formData.cuisineType}
              onChange={handleChange}
              className="w-full p-2 rounded border"
            >
              <option value="">Select Cuisine Type</option>
              {[
                "Sri Lankan",
                "Indian",
                "Chinese",
                "Fast Food",
                "Pizza",
                "Bakery",
                "Seafood",
                "Other",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.cuisineType && (
              <p className="text-red-500 text-sm">{errors.cuisineType}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-darkGreen text-white font-semibold py-2 rounded hover:bg-oliveGreen"
          >
            Register Restaurant
          </button>
        </form>
      </div>
    </div>
    </div>
    <Footer />
    </div>
  );
}
