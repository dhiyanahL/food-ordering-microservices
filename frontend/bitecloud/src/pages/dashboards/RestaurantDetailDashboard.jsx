import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { XMarkIcon } from "@heroicons/react/24/solid"; // for close (delete) button
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";

export default function RestaurantDetailDashboard() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [editingRestaurant, setEditingRestaurant] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState({});
  const [restaurantErrors, setRestaurantErrors] = useState({});
  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    imageUrl: "",
    available: true,
  });
  const [menuErrors, setMenuErrors] = useState({});
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [showMenuItems, setShowMenuItems] = useState(true);
  const [uploading, setUploading] = useState(false);
  //const [notifications, setNotifications] = useState([]);
 //const [showNotifications, setShowNotifications] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    {/*axios
      .get(`http://localhost:5400/restaurant-notifications/${restaurantId}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error("Failed to load notifications", err)); */}

    axios
      .get(`http://localhost:5400/restaurants/${restaurantId}`)
      .then((res) => {
        setRestaurant(res.data);
        setRestaurantForm(res.data);
      });

    axios
      .get(`http://localhost:5400/restaurants/${restaurantId}/menu`)
      .then((res) => {
        setMenuItems(res.data);
      });
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurantForm({ ...restaurantForm, [name]: value });
  };

  const handleMenuChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuForm({ ...menuForm, [name]: type === "checkbox" ? checked : value });
  };

  const saveRestaurant = () => {
    const errors = {};
    if (!restaurantForm.name) errors.name = "Name is required";
    if (!restaurantForm.email) errors.email = "Email is required";
    if (!restaurantForm.contactNumber)
      errors.contactNumber = "Phone is required";
    if (!restaurantForm.address) errors.address = "Address is required";
    if (!restaurantForm.imageUrl) errors.imageUrl = "Image URL is required";

    if (Object.keys(errors).length > 0) return setRestaurantErrors(errors);

    axios
      .put(
        `http://localhost:5400/restaurants/${restaurantId}`,
        restaurantForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setRestaurant(res.data);
        setEditingRestaurant(false);
        alert("✅ Restaurant updated!");
      })
      .catch(() => alert("❌ Failed to update restaurant"));
  };

  const addMenuItem = () => {
    const errors = {};
    if (!menuForm.name) errors.name = "Name is required";
    if (!menuForm.price) errors.price = "Price is required";
    if (!menuForm.imageUrl) errors.imageUrl = "Image URL is required";

    if (Object.keys(errors).length > 0) return setMenuErrors(errors);

    axios
      .post(
        `http://localhost:5400/restaurants/${restaurantId}/menu`,
        menuForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setMenuItems([...menuItems, res.data]);
        setMenuForm({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          imageUrl: "",
          available: true,
        });
        setMenuErrors({});
      })
      .catch(() => alert("❌ Failed to add menu item"));
  };

  const startEditingMenu = (item) => {
    setEditingMenuId(item._id);
    setMenuForm(item);
  };

  const updateMenuItem = () => {
    axios
      .put(
        `http://localhost:5400/restaurants/${restaurantId}/menu/${editingMenuId}`,
        menuForm,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setMenuItems(
          menuItems.map((item) =>
            item._id === editingMenuId ? res.data : item
          )
        );
        setEditingMenuId(null);
        setMenuForm({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          imageUrl: "",
          available: true,
        });
      })
      .catch(() => alert("❌ Failed to update menu item"));
  };

  const deleteMenuItem = (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?"))
      return;
    axios
      .delete(`http://localhost:5400/restaurants/${restaurantId}/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMenuItems(menuItems.filter((item) => item._id !== id));
      })
      .catch(() => alert("❌ Failed to delete menu item"));
  };

  const deleteRestaurant = () => {
    if (!window.confirm("Are you sure you want to delete this restaurant?"))
      return;
    axios
      .delete(`http://localhost:5400/restaurants/${restaurantId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        alert("Restaurant deleted");
        navigate("/restaurant/dashboard");
      })
      .catch(() => alert("❌ Failed to delete restaurant"));
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
  };*/}

  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(
      regex,
      '<mark class="bg-transparent font-bold text-darkGreen">$1</mark>'
    );
  };

  if (!restaurant) return <div className="p-8">Loading...</div>;

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
        <div className="w-[95%] mx-auto bg-lightGreen/85 shadow-xl rounded-2xl p-8">
          {/*<div className="p-8 bg-offWhite min-h-screen font-sans">*/}
          <h1 className="text-4xl font-bold text-darkGreen font-kalnia mb-4 text-center">
            Restaurant Dashboard – {restaurant?.name}
            {/*Dashboard for Restaurant ID: {restaurantId} */}
          </h1>

          {restaurant.status !== "approved" && (
            <p className="text-red-600 font-semibold mb-4">
              ⚠️ This restaurant is not yet approved
            </p>
          )}

          {/* Notifications Icon + Dropdown */}
          {/*
        <div className="mb-6 relative">
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
            <div className="absolute mt-2 w-full max-w-md bg-softBeige border border-softBeige rounded-xl shadow-md p-4 z-10">
              <h2 className="text-lg font-semibold text-darkGreen mb-2 font-kalnia">
                Notifications
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
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
                    <button onClick={() => deleteNotification(note._id)}>
                      <XMarkIcon className="h-4 w-4 ml-2 hover:text-black" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div> */}

          {/* Restaurant Info */}
          <div className="bg-softBeige border-4 border-oliveGreen p-6 rounded-xl shadow mb-8">
            <h2 className="text-2xl font-bold text-darkGreen mb-4 font-kalnia">
              Restaurant Info
            </h2>
            {!editingRestaurant ? (
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={restaurant.imageUrl}
                  alt="restaurant"
                  className="h-[300px] w-[600px] object-cover rounded"
                />
                <div className="space-y-1">
                  <p>
                    <strong>Restaurant ID:</strong> {restaurantId}
                  </p>
                  <p>
                    <strong>Name:</strong> {restaurant.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {restaurant.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {restaurant.contactNumber}
                  </p>
                  <p>
                    <strong>Address:</strong> {restaurant.address}
                  </p>
                  <p>
                    <strong>Hours:</strong> {restaurant.openTime} –{" "}
                    {restaurant.closeTime}
                  </p>
                  <p>
                    <strong>Cuisine Type:</strong> {restaurant.cuisineType}
                  </p>
                  <p>
                    <strong>Status:</strong> {restaurant.status}
                  </p>
                  <button
                    onClick={() => setEditingRestaurant(true)}
                    className="mt-3 bg-oliveGreen text-white px-4 py-1 rounded"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {[
                  "name",
                  "email",
                  "contactNumber",
                  "address",
                  "openTime",
                  "closeTime",
                ].map((field) => (
                  <div key={field}>
                    <input
                      name={field}
                      value={restaurantForm[field] || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded"
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                    />
                    {restaurantErrors[field] && (
                      <p className="text-red-500 text-sm">
                        {restaurantErrors[field]}
                      </p>
                    )}
                  </div>
                ))}

                {/* Cuisine Type Dropdown */}
                <div>
                  <label className="block text-sm text-darkGreen font-medium mb-1">
                    Cuisine Type
                  </label>
                  <select
                    name="cuisineType"
                    value={restaurantForm.cuisineType?.[0] || ""}
                    onChange={(e) =>
                      setRestaurantForm({
                        ...restaurantForm,
                        cuisineType: [e.target.value],
                      })
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Cuisine</option>
                    {[
                      "Sri Lankan",
                      "Indian",
                      "Chinese",
                      "Fast Food",
                      "Pizza",
                      "Bakery",
                      "Seafood",
                      "Other",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {restaurantErrors.cuisineType && (
                    <p className="text-red-500 text-sm">
                      {restaurantErrors.cuisineType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-darkGreen font-medium mb-1">
                    Restaurant Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = await uploadToCloudinary(file);
                        setRestaurantForm({ ...restaurantForm, imageUrl: url });
                      }
                    }}
                    className="w-full p-2 border rounded"
                  />
                  {restaurantErrors.imageUrl && (
                    <p className="text-red-500 text-sm">
                      {restaurantErrors.imageUrl}
                    </p>
                  )}

                  {/* Image Preview */}
                  {restaurantForm.imageUrl && (
                    <img
                      src={restaurantForm.imageUrl}
                      alt="Preview"
                      className="h-[300px] w-[400px] object-cover rounded-xl mt-2"
                    />
                  )}
                </div>

                <button
                  onClick={saveRestaurant}
                  className="bg-darkGreen text-white px-4 py-1 rounded"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="bg-softBeige border-4 border-oliveGreen p-6 rounded-xl shadow mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-darkGreen font-kalnia">
                Menu Items
              </h2>
              <button
                onClick={() => setShowMenuItems(!showMenuItems)}
                className="text-sm text-oliveGreen underline hover:text-darkGreen"
              >
                {showMenuItems ? "Hide" : "Show"}
              </button>
            </div>
            {/* ✅ Add Item Toggle Button*/}
            <div className="mb-4">
              <button
                onClick={() => setShowAddForm((prev) => !prev)}
                className="bg-darkGreen text-white px-4 py-2 rounded font-semibold hover:bg-oliveGreen"
              >
                ➕ Add New Item
              </button>
            </div>

            {/* 🔽 Add New Item Form (Toggles on click) */}
            {showAddForm && (
              <div className="mb-6 border-4 border-lightGreen bg-offWhite rounded-xl p-6 shadow-md">
                <h3 className="font-semibold mb-2 text-darkGreen">
                  New Menu Item
                </h3>
                {/* Form Fields */}
                {["name", "description", "price", "originalPrice"].map(
                  (field) => (
                    <div key={field}>
                      <input
                        name={field}
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        value={menuForm[field]}
                        onChange={handleMenuChange}
                        className="w-full mb-2 p-2 border rounded"
                      />
                      {menuErrors[field] && (
                        <p className="text-red-500 text-sm">
                          {menuErrors[field]}
                        </p>
                      )}
                    </div>
                  )
                )}

                {/* Image Upload + Preview */}
                <div>
                  <label className="block text-sm font-semibold text-darkGreen mb-1">
                    Menu Item Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setUploading(true);
                        const url = await uploadToCloudinary(file);
                        setUploading(false);
                        setMenuForm({ ...menuForm, imageUrl: url });
                      }
                    }}
                    className="w-full p-2 border rounded mb-2"
                  />
                  {uploading && (
                    <p className="text-sm text-gray-500">Uploading...</p>
                  )}
                  {menuForm.imageUrl && (
                    <img
                      src={menuForm.imageUrl}
                      alt="Preview"
                      className="h-[300px] w-[400px] object-cover rounded-xl mb-2"
                    />
                  )}
                  {menuErrors.imageUrl && (
                    <p className="text-red-500 text-sm">
                      {menuErrors.imageUrl}
                    </p>
                  )}
                </div>

                <label className="flex gap-2 items-center text-sm text-darkGreen mt-2">
                  <input
                    type="checkbox"
                    name="available"
                    checked={menuForm.available}
                    onChange={handleMenuChange}
                  />
                  Available
                </label>

                <button
                  onClick={() => {
                    addMenuItem();
                    setShowAddForm(false); // 👈 Hide form after submission
                  }}
                  className="bg-darkGreen text-white px-4 py-2 rounded mt-2"
                >
                  Add
                </button>
              </div>
            )}

            {showMenuItems && (
              <>
                {/*Search*/}
                <div className="flex justify-end mb-6">
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-oliveGreen bg-softBeige text-darkGreen rounded px-3 py-2 w-full md:w-80 shadow focus:outline-none focus:ring-2 focus:ring-oliveGreen"
                  />
                </div>

                {/* MENU LIST */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredMenuItems.map((item) => (
                    <div
                      key={item._id}
                      className="border-4 border-lightGreen bg-offWhite rounded-xl p-4 shadow hover:shadow-md transition"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-[300px] w-[400px] object-cover rounded-xl mb-3"
                      />
                      <p
                        className="font-bold"
                        dangerouslySetInnerHTML={{
                          __html: highlightMatch(item.name, searchQuery),
                        }}
                      ></p>

                      {item.description && (
                        <p
                          className="text-sm text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(
                              item.description,
                              searchQuery
                            ),
                          }}
                        ></p>
                      )}
                      <p>Rs. {item.price}</p>
                      {item.originalPrice && (
                        <p className="line-through text-sm">
                          Rs. {item.originalPrice}
                        </p>
                      )}
                      <p className="text-xs text-green-600">
                        {item.available ? "Available" : "Unavailable"}
                      </p>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => startEditingMenu(item)}
                          className="text-blue-500 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMenuItem(item._id)}
                          className="text-red-500 text-sm"
                        >
                          Delete
                        </button>
                      </div>

                      {/* Edit Form */}
                      {editingMenuId === item._id && (
                        <div className="mt-4 space-y-2">
                          {[
                            "name",
                            "description",
                            "price",
                            "originalPrice",
                          ].map((field) => (
                            <input
                              key={field}
                              name={field}
                              value={menuForm[field]}
                              onChange={handleMenuChange}
                              className="w-full p-2 border rounded"
                              placeholder={
                                field.charAt(0).toUpperCase() + field.slice(1)
                              }
                            />
                          ))}

                          {/* File input for updated image */}
                          <div>
                            <label className="text-sm font-medium text-darkGreen">
                              Change Image
                            </label>

                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const url = await uploadToCloudinary(file);
                                  setUploading(false);
                                  setMenuForm({ ...menuForm, imageUrl: url });
                                }
                              }}
                              className="w-full p-2 border rounded"
                            />
                            {uploading && (
                              <p className="text-sm text-gray-500">
                                Uploading...
                              </p>
                            )}
                            {menuForm.imageUrl && (
                              <img
                                src={menuForm.imageUrl}
                                alt="Preview"
                                className="h-[300px] w-[400px] object-cover rounded-xl mt-2"
                              />
                            )}
                          </div>

                          <label className="flex gap-2 items-center text-sm text-darkGreen">
                            <input
                              type="checkbox"
                              name="available"
                              checked={menuForm.available}
                              onChange={handleMenuChange}
                            />
                            Available
                          </label>
                          <button
                            onClick={updateMenuItem}
                            className="bg-oliveGreen text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* Orders Placeholder */}
          <div className="bg-softBeige border-4 border-oliveGreen p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-semibold text-darkGreen font-kalnia mb-2">
              📦 Orders
            </h2>
            <p className="text-gray-600">
              This section will display all orders related to this restaurant.
            </p>
            <p className="text-sm text-gray-500">
              We'll implement this after integrating with the Order Service.
            </p>
          </div>

          {/* Delete Restaurant */}
          <div className="text-right mt-8">
            <button
              onClick={deleteRestaurant}
              className="text-red-700 font-semibold border-4 border-red-700 px-5 py-2 rounded-md hover:bg-red-100 transition-all duration-200"
            >
              Delete Restaurant
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
