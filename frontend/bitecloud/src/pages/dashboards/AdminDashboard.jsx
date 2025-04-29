import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {
 
  const [userCountsByRole, setUserCountsByRole] = useState([]);
  const [offers, setOffers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    console.log("Fetching dashboard data...");
    const fetchDashboardData = async () => {
      try {
        // Fetch offers
        const offersRes = await axios.get("http://localhost:5100/admin/offers/top-5");
        setOffers(offersRes.data.offers);

       
        // Fetch user counts by role
        console.log("Fetching user counts by role...");
        const roleCountsRes = await axios.get("http://localhost:5000/api/user/getusercountsbyrole", config);
        setUserCountsByRole(roleCountsRes.data);
        

        
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
        <Sidebar role="Admin" isOpen={sidebarOpen} />

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            
            {/* User Counts by Role */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-oliveGreen">
              <h3 className="text-2xl font-bold text-darkGreen mb-4">Users by Role</h3>
              {loading ? (
                <p>Loading counts...</p>
              ) : (
                <ul>
                  {userCountsByRole.map((role) => (
                    <li key={role._id} className="flex justify-between border-b border-oliveGreen py-2">
                      <span className="font-semibold text-xl text-black ">{role._id}</span>
                      <span className="text-oliveGreen font-bold text-xl">{role.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Top 5 Offers */}
            <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-oliveGreen">
              <h3 className="text-2xl font-bold text-darkGreen mb-4">Top Offers</h3>
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

            

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
