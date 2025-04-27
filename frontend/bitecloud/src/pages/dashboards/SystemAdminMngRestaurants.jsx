import { useState, useEffect } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import axios from "axios";

export default function SystemAdminMngRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [summary, setSummary] = useState({ totalRestaurants: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedRestaurantId, setExpandedRestaurantId] = useState(null); // For View Details

  useEffect(() => {
    fetchRestaurants();
    fetchSummary();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:5400/restaurants");
      setRestaurants(res.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5100/admin/dashboard/restaurant-summary");
      setSummary(res.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5100/admin/restaurants/${id}/status`, { status });
      fetchRestaurants();
      fetchSummary();
    } catch (error) {
      console.error("Error updating restaurant status:", error);
    }
  };

  const deleteRestaurant = async (id) => {
    const reason = prompt("Enter reason for deleting this restaurant:");
    if (!reason) return;

    try {
      await axios.delete(`http://localhost:5100/admin/restaurants/${id}`, { data: { reason } });
      fetchRestaurants();
      fetchSummary();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const toggleDetails = (id) => {
    if (expandedRestaurantId === id) {
      setExpandedRestaurantId(null); // Collapse if clicking again
    } else {
      setExpandedRestaurantId(id);
    }
  };

  const filteredRestaurants = restaurants.filter(r => 
    filterStatus === "all" ? true : r.status === filterStatus
  );

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
        <Sidebar role="Admin" isOpen={sidebarOpen} />

        <div className="flex-1 flex justify-center p-6 overflow-auto">
          <div className="w-full max-w-6xl bg-white rounded-2xl border-4 border-oliveGreen p-8 shadow-2xl">

            <h2 className="text-4xl font-bold text-darkGreen mb-8">Manage Restaurants</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <SummaryCard title="Total" value={summary.totalRestaurants} />
              <SummaryCard title="Pending" value={summary.pending} />
              <SummaryCard title="Approved" value={summary.approved} />
              <SummaryCard title="Rejected" value={summary.rejected} />
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6 justify-center">
              {["all", "pending", "approved", "rejected"].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full font-semibold ${
                    filterStatus === status
                      ? "bg-oliveGreen text-white"
                      : "bg-softBeige text-darkGreen border border-oliveGreen"
                  } hover:bg-oliveGreen hover:text-white transition duration-300`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Restaurants Table */}
            {loading ? (
              <p>Loading restaurants...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-oliveGreen text-white">
                      <th className="p-3">Name</th>
                      <th className="p-3">Owner ID</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRestaurants.map((restaurant) => (
                      <>
                        <tr key={restaurant._id} className="border-b hover:bg-softBeige">
                          <td className="p-3 font-semibold">{restaurant.name}</td>
                          <td className="p-3">{restaurant.ownerId || "N/A"}</td>
                          <td className="p-3 capitalize">{restaurant.status}</td>
                          <td className="p-3 flex flex-wrap gap-2">
                            <button
                              onClick={() => updateStatus(restaurant._id, "approved")}
                              className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(restaurant._id, "rejected")}
                              className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => deleteRestaurant(restaurant._id)}
                              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => toggleDetails(restaurant._id)}
                              className="bg-darkGreen text-white px-3 py-1 rounded-lg hover:bg-green-800"
                            >
                              {expandedRestaurantId === restaurant._id ? "Hide Details" : "View Details"}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Details */}
                        {expandedRestaurantId === restaurant._id && (
                          <tr>
                            <td colSpan="4" className="bg-softBeige p-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-darkGreen">
                                <div><strong>Email:</strong> {restaurant.email || "N/A"}</div>
                                <div><strong>Contact Number:</strong> {restaurant.contactNumber || "N/A"}</div>
                                <div><strong>Address:</strong> {restaurant.address || "N/A"}</div>
                                <div><strong>Open Time:</strong> {restaurant.openTime || "N/A"}</div>
                                <div><strong>Close Time:</strong> {restaurant.closeTime || "N/A"}</div>
                                <div><strong>Cuisine Types:</strong> {restaurant.cuisineType?.join(", ") || "N/A"}</div>
                                <div><strong>Created At:</strong> {new Date(restaurant.createdAt).toLocaleString() || "N/A"}</div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-oliveGreen text-center">
      <h4 className="text-xl font-bold text-darkGreen mb-2">{title}</h4>
      <p className="text-3xl font-bold text-oliveGreen">{value}</p>
    </div>
  );
}
