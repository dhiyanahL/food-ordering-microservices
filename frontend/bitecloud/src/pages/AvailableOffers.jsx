import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify"; // optional for nice notifications

export default function AvailableOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await axios.get("http://localhost:5100/admin/offers");
      setOffers(res.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffer = () => {
    navigate("/admin/add-offer");
  };

  const handleEditOffer = (id) => {
    navigate(`/admin/edit-offer/${id}`);
  };

  const handleDeleteOffer = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await axios.delete(`http://localhost:5100/admin/offers/${id}`);
        toast.success("Offer deleted successfully!");
        fetchOffers();
      } catch (error) {
        console.error("Error deleting offer:", error);
        toast.error("Failed to delete offer.");
      }
    }
  };

  const getStatusClass = (status) => {
    if (status === "ongoing") return "bg-green-500 text-white";
    if (status === "expired") return "bg-red-500 text-white";
    return "bg-gray-200";
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
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar role="Admin" isOpen={sidebarOpen} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-6xl bg-white p-6 rounded-2xl shadow-md border-2 border-oliveGreen">
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-center text-darkGreen font-kalnia mb-4">
                Available Offers
              </h2>
              <div className="flex justify-end">
                <button
                  onClick={handleAddOffer}
                  className="bg-darkGreen text-white px-5 py-2 rounded-xl hover:bg-oliveGreen transition font-[Kalnia]"
                >
                  + Add Offer
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-center text-slateGray text-lg">Loading offers...</p>
            ) : offers.length === 0 ? (
              <p className="text-center text-slateGray text-lg">No offers available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-oliveGreen text-left">
                  <thead className="bg-oliveGreen text-white">
                    <tr>
                      <th className="py-3 px-4 border border-softBeige text-center">Title</th>
                      <th className="py-3 px-4 border border-softBeige text-center">Description</th>
                      <th className="py-3 px-4 border border-softBeige text-center">Discount (%)</th>
                      <th className="py-3 px-4 border border-softBeige text-center">Valid From</th>
                      <th className="py-3 px-4 border border-softBeige text-center">Valid Till</th>
                      <th className="py-3 px-4 border border-softBeige text-center">Status</th>
                      <th className="py-3 px-4 border border-softBeige text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((offer) => (
                      <tr key={offer._id} className="hover:bg-[#f7f9f5] transition duration-200">
                        <td className="py-3 px-4 border border-softBeige text-center">{offer.title}</td>
                        <td className="py-3 px-4 border border-softBeige text-center">{offer.description || "-"}</td>
                        <td className="py-3 px-4 border border-softBeige text-center">{offer.discountPercentage}%</td>
                        <td className="py-3 px-4 border border-softBeige text-center">{new Date(offer.validFrom).toLocaleDateString()}</td>
                        <td className="py-3 px-4 border border-softBeige text-center">{new Date(offer.validTill).toLocaleDateString()}</td>
                        <td className={`py-3 px-4 border border-softBeige text-center ${getStatusClass(offer.status)}`}>{offer.status}</td>
                        <td className="py-3 px-4 border border-softBeige text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleEditOffer(offer._id)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(offer._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}