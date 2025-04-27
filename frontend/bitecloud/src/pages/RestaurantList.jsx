// src/pages/RestaurantList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function RestaurantList  () {
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openOnly, setOpenOnly] = useState(false);
  const [categories, setCategories] = useState([]);  
    const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Load approved restaurants & extract categories
  useEffect(() => {
    axios
      .get("http://localhost:5400/restaurants/approved")
      .then((res) => {
        setRestaurants(res.data);
        setAllRestaurants(res.data);
        const uniqueCategories = [
          ...new Set(res.data.flatMap((r) => r.cuisineType)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) =>
        console.error("❌ Error loading approved restaurants:", err)
      );
  }, []);

  // Live search when query changes
  useEffect(() => {
    const fetchSearch = async () => {
      if (!query.trim()) {
        setRestaurants(allRestaurants);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5400/restaurants/search?query=${query}`
        );
        setRestaurants(res.data);
      } catch (err) {
        console.error("❌ Search error:", err);
      }
    };

    fetchSearch();
  }, [query, allRestaurants]);

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      '<mark class="bg-transparent font-bold text-darkGreen">$1</mark>'
    );
  };

  // Filter by category
  const handleCategory = async (category) => {
    setSelectedCategory(category);
    if (!category) return setRestaurants(allRestaurants);
    try {
      const res = await axios.get(
        `http://localhost:5400/restaurants/category/${category}`
      );
      setRestaurants(res.data);
    } catch (err) {
      console.error("❌ Category filter error:", err);
    }
  };

  // Filter open-only
  const handleToggle = () => {
    setOpenOnly(!openOnly);
  
    if (!openOnly) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
      const filtered = allRestaurants.filter((r) => {
        if (r.openTime < r.closeTime) {
          return currentTime >= r.openTime && currentTime < r.closeTime;
        } else {
          return currentTime >= r.openTime || currentTime < r.closeTime;
        }
      });
  
      setRestaurants(filtered);
    } else {
      setRestaurants(allRestaurants);
    }
  };
  

  const handleAddFavorite = async (restaurantId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/user/add-favorite",
        { restaurantId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Added to favorites!");
    } catch (error) {
      console.error("❌ Error adding to favorites:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Badge component to show restaurant open status
  // ✅ Frontend-only OpenStatusBadge
const OpenStatusBadge = ({ openTime, closeTime }) => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  let isOpen = false;
  if (openTime < closeTime) {
    isOpen = currentTime >= openTime && currentTime < closeTime;
  } else {
    isOpen = currentTime >= openTime || currentTime < closeTime;
  }

  return (
    <div
      className={`absolute top-2 right-2 px-2 py-2 text-[12px] font-semibold rounded-full shadow ${
        isOpen ? "bg-green-600" : "bg-red-500"
      } text-white`}
    >
      {isOpen ? "Open now" : "Closed"}
    </div>
  );
};


  return (
    <div
    className="flex min-h-screen flex-col"
      style={{
        backgroundImage: `url('/images/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        <Sidebar role="Customer" isOpen={sidebarOpen} />

      {/* Inner content wrapper with padding all around */}
      <div className="w-[95%] mx-auto bg-lightGreen/85 shadow-xl rounded-2xl p-8">
        {/*<div className="p-8 bg-offWhite min-h-screen font-sans">*/}
        <h1 className="text-4xl font-bold text-darkGreen text-center font-kalnia mb-10">
          Browse Restaurants
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 bg-softBeige p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search by name or cuisine..."
            className="border rounded px-3 py-2 w-full sm:w-64 shadow"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            className="border rounded px-3 py-2 w-full sm:w-52 shadow"
            value={selectedCategory}
            onChange={(e) => handleCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={openOnly} onChange={handleToggle} />
            <span className="text-sm text-darkGreen font-semibold">
              Open now
            </span>
          </label>
        </div>

        {/* Restaurant Cards */}
        {restaurants.length === 0 ? (
          <p className="text-center text-red-500 font-semibold">
            No restaurants available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/customer/restaurants/${r._id}/menu`)}
                className="bg-softBeige rounded-2xl shadow hover:shadow-xl transition duration-300 overflow-hidden"
              >
                <div className="relative">
                  <div
                    //onClick={() => navigate(`/restaurants/${r._id}/menu`)}
                    className="relative cursor-pointer"
                  >
                    <img
                      src={r.imageUrl || "https://via.placeholder.com/400x200"}
                      alt={r.name}
                      className="h-[200px] w-full object-cover rounded-t-2xl transition-transform duration-300 hover:scale-105"
                    />
                    <OpenStatusBadge openTime={r.openTime} closeTime={r.closeTime} />

                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ Prevents card click
                      handleAddFavorite(r._id);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium mt-2"
                  >
                    ❤️ Add to Favorites
                  </button>
                </div>
                <div className="p-4 text-darkGreen space-y-1">
                  <h2
                    className="text-lg font-bold mb-1"
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(r.name, query),
                    }}
                  ></h2>
                  <p
                    className="text-sm text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(r.address, query),
                    }}
                  ></p>
                  <p
                    className="text-sm mt-1 text-oliveGreen"
                    dangerouslySetInnerHTML={{
                      __html: highlightMatch(r.cuisineType?.join(", "), query),
                    }}
                  ></p>
                  <p className="text-xs text-gray-500 mt-2">
                    Open: {r.openTime} – {r.closeTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <Footer />
    </div>
  );
};


//export default RestaurantList;
