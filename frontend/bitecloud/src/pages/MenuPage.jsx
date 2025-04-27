import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function MenuPage() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [quantityInputs, setQuantityInputs] = useState({});

  // Load menu items
  const fetchMenu = async () => {
    try {
      const baseUrl = `http://localhost:5400/restaurants/${restaurantId}/menu`;
      let items = [];

      // Both filters selected
      if (availableOnly && discountedOnly) {
        const res = await axios.get(baseUrl);
        items = res.data.filter((item) => item.available && item.originalPrice);
      }
      // Only Available
      else if (availableOnly) {
        const res = await axios.get(`${baseUrl}/available`);
        items = res.data;
      }
      // Only Discounts
      else if (discountedOnly) {
        const res = await axios.get(`${baseUrl}/promotions`);
        items = res.data;
      }
      // No filters
      else {
        const res = await axios.get(baseUrl);
        items = res.data;
      }

      setMenuItems(items);
    } catch (err) {
      console.error("❌ Error loading menu:", err);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return fetchMenu();

    try {
      const res = await axios.get(
        `http://localhost:5400/restaurants/${restaurantId}/menu/search?query=${query}`
      );
      setMenuItems(res.data);
    } catch (err) {
      console.error("❌ Search error:", err);
    }
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // Restaurant Details
        const restaurantRes = await axios.get(
          `http://localhost:5400/restaurants/${restaurantId}`
        );
        setRestaurantDetails(restaurantRes.data);

        // Open Status
        const statusRes = await axios.get(
          `http://localhost:5400/restaurants/${restaurantId}/status`
        );
        setIsRestaurantOpen(statusRes.data.isOpen);
      } catch (err) {
        console.error("❌ Error loading restaurant info:", err);
        setIsRestaurantOpen(false);
      }

      // Menu logic
      try {
        const baseUrl = `http://localhost:5400/restaurants/${restaurantId}/menu`;
        let items = [];

        if (query.trim()) {
          const searchRes = await axios.get(`${baseUrl}/search?query=${query}`);
          items = searchRes.data;
        } else if (availableOnly && discountedOnly) {
          const res = await axios.get(baseUrl);
          items = res.data.filter(
            (item) => item.available && item.originalPrice
          );
        } else if (availableOnly) {
          const res = await axios.get(`${baseUrl}/available`);
          items = res.data;
        } else if (discountedOnly) {
          const res = await axios.get(`${baseUrl}/promotions`);
          items = res.data;
        } else {
          const res = await axios.get(baseUrl);
          items = res.data;
        }

        setMenuItems(items);
      } catch (err) {
        console.error("❌ Error loading menu:", err);
      }
    };

    loadData();
  }, [query, restaurantId, availableOnly, discountedOnly]);

  const handleQuantityChange = (itemId, value) => {
    const qty = parseInt(value, 10);
    setQuantityInputs((prev) => ({
      ...prev,
      [itemId]: isNaN(qty) || qty < 1 ? 1 : qty,
    }));
  };

  const handleAddToCart = async (item) => {
    try {
      const token = localStorage.getItem("token");
      const customerId = localStorage.getItem("userId");
      const customerName = localStorage.getItem("userName");
      const quantity = quantityInputs[item._id] || 1;

      console.log("Adding to cart: ", {
        itemId: item._id,
        itemName: item.name,
        price: item.price,
        quantity,
        restaurantId,
        customerId,
        customerName,
      });

      const payload = {
        customerId,
        customerName,
        itemId: item._id,
        itemName: item.name,
        price: item.price,
        quantity,
        restaurantId: restaurantId,
        currencyCode: "LKR",
      };

      const res = await axios.post(
        "http://localhost:5500/api/cart/cart/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Item added to cart!");
      console.log(res.data.cart);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      alert(error.response?.data?.message || "Could not add to cart.");
    }
  };

  return (
    <div
      className="min-h-screen bg-repeat bg-center bg-fixed p-6"
      style={{
        backgroundImage: `url('/bg.jpg')`,
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
        backgroundPosition: "top center",
      }}
    >
      {/* Inner content wrapper with padding all around */}
      <div className="w-[95%] mx-auto bg-lightGreen/85 shadow-xl rounded-2xl p-8">
        {/*<div className="p-8 bg-offWhite min-h-screen font-sans">*/}
        <button
          onClick={() => navigate("/customer/restaurants/approved")}
          className="mb-6 bg-darkGreen text-white px-4 py-2 rounded hover:bg-oliveGreen"
        >
          ← Back to Restaurants
        </button>

        {restaurantDetails && (
          <div className="bg-softBeige rounded-xl p-6 mb-6 shadow text-darkGreen">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={
                  restaurantDetails.imageUrl ||
                  "https://via.placeholder.com/400x200"
                }
                alt={restaurantDetails.name}
                className="h-[300px] w-[400px] object-cover rounded-xl shadow"
              />
              <div className="flex-1">
                <h2 className="text-3xl font-kalnia font-bold mb-2">
                  {restaurantDetails.name}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  {restaurantDetails.address}
                </p>
                <p className="text-sm text-oliveGreen">
                  Cuisine: {restaurantDetails.cuisineType?.join(", ")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Open: {restaurantDetails.openTime} –{" "}
                  {restaurantDetails.closeTime}
                </p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-darkGreen font-kalnia mb-4">
          Menu
        </h1>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Search menu item..."
            className="border border-softBeige bg-softBeige text-darkGreen placeholder-darkGreen rounded px-3 py-2 w-full sm:w-96 lg:w-[30rem] shadow focus:outline-none focus:ring-2 focus:ring-oliveGreen"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={() => setAvailableOnly(!availableOnly)}
            />
            <span className="text-sm text-darkGreen font-semibold">
              Only Available
            </span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={discountedOnly}
              onChange={() => setDiscountedOnly(!discountedOnly)}
            />
            <span className="text-sm text-darkGreen font-semibold">
              Only Discounts
            </span>
          </label>
        </div>

        {/* Menu Items */}
        {menuItems.length === 0 ? (
          <p className="text-red-500">No menu items available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-softBeige rounded-xl shadow p-4 relative hover:shadow-lg transition"
              >
                <img
                  src={item.imageUrl || "https://via.placeholder.com/400x200"}
                  alt={item.name}
                  className="h-[250px] w-full object-cover rounded-md mb-3"
                />
                {/*On sale label*/}
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-pink-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md tracking-wide uppercase">
                    On Sale
                  </span>
                )}
                {/*Unavailable label*/}
                {!item.available && (
                  <span className="absolute top-2 right-2 bg-gray-700 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md tracking-wide">
                    Unavailable
                  </span>
                )}

                <h2
                  className="text-lg font-bold text-darkGreen"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(item.name, query),
                  }}
                ></h2>

                <p
                  className="text-gray-700 text-sm mb-2"
                  dangerouslySetInnerHTML={{
                    __html: highlightMatch(item.description, query),
                  }}
                ></p>

                <div className="text-oliveGreen font-semibold mb-2">
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="line-through text-gray-500 mr-2">
                      Rs. {item.originalPrice}
                    </span>
                  )}
                  Rs. {item.price}
                </div>
                <div className="mb-2">
                  <label className="text-sm text-darkGreen font-medium mr-2">
                    Qty:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantityInputs[item._id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(item._id, e.target.value)
                    }
                    className="w-16 px-2 py-1 border rounded text-sm"
                  />
                </div>

                <button
                  onClick={() => handleAddToCart(item, item.restaurantId)}
                  className="bg-darkGreen text-white px-3 py-1 rounded hover:bg-oliveGreen disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!item.available || !isRestaurantOpen}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

//export default MenuPage;
