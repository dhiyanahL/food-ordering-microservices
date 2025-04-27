import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [offers, setOffers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching dashboard data...");
    const fetchDashboardData = async () => {
      try {
        // Fetch total users, top 5 offers, and recent activity
        const offersRes = await axios.get("http://localhost:5100/admin/offers/top-5");
        console.log("Offers response data:", offersRes.data.offers); // 👈 updated log here
        setOffers(offersRes.data.offers);

        const usersRes = await axios.get("http://localhost:5100/admin/users/count");
        setUsersCount(usersRes.data.count);

        const activityRes = await axios.get("http://localhost:5100/admin/activity/recent");
        setRecentActivity(activityRes.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error.response || error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundImage: `url('/images/bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar + Main Content */}
      <div className="flex flex-1">
        <Sidebar role="Admin" isOpen={sidebarOpen} />

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Users */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-oliveGreen">
              <h3 className="text-2xl font-bold text-darkGreen mb-4">Total Users</h3>
              <p className="text-4xl font-bold text-oliveGreen">{loading ? "Loading..." : usersCount}</p>
            </div>

            {/* Top 5 Offers */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-oliveGreen">
              <h3 className="text-2xl font-bold text-darkGreen mb-4">Top  Offers</h3>
              {loading ? (
                <p>Loading offers...</p>
              ) : offers.length === 0 ? (
                <p className="text-slateGray">No ongoing offers found.</p>
              ) : (
                <ul>
                  {offers.map((offer) => (
                    <li key={offer._id} className="border-b border-oliveGreen py-2">
                      <p className="font-bold">{offer.title}</p>
                      <p className="text-slateGray">{offer.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-oliveGreen">
              <h3 className="text-2xl font-bold text-darkGreen mb-4">Recent Activity</h3>
              {loading ? (
                <p>Loading activity...</p>
              ) : (
                <ul>
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <li key={index} className="border-b border-oliveGreen py-2">
                      <p>{activity.description}</p>
                      <p className="text-sm text-slateGray">{new Date(activity.timestamp).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
