import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function EditOfferForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTill, setValidTill] = useState("");
  const [errors, setErrors] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // get offer ID from route params

  // Fetch existing offer data
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await axios.get(`http://localhost:5100/admin/offers/${id}`);
        console.log(response.data);
        const offer = response.data;
        setTitle(offer.title);
        setDescription(offer.description);
        setDiscountPercentage(offer.discountPercentage);
        setValidFrom(offer.validFrom.split("T")[0]); // format date for input
        setValidTill(offer.validTill.split("T")[0]);
      } catch (error) {
        toast.error("Failed to fetch offer details");
      }
    };

    fetchOffer();
  }, [id]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!discountPercentage || discountPercentage < 0 || discountPercentage > 100)
      newErrors.discountPercentage = "Enter a valid discount (0-100)";
    if (!validFrom) newErrors.validFrom = "Start date is required";
    if (!validTill) newErrors.validTill = "End date is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedOffer = {
      title,
      description,
      discountPercentage,
      validFrom,
      validTill,
    };

    try {
      await axios.put(`http://localhost:5100/admin/offers/${id}`, updatedOffer);
      toast.success("Offer updated successfully!");
      navigate("/available-offers");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update offer");
    }
  };

  return (
    <div
      className="flex min-h-screen font-sans"
      style={{
        backgroundImage: `url('/images/bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Sidebar role="Admin" isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleFormSubmit}
              className="bg-offWhite p-8 rounded-2xl shadow-md border-2 border-oliveGreen"
            >
              <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 via-lime-500 to-green-800 bg-clip-text text-transparent font-kalnia text-center mb-8">
                Edit Offer
              </h2>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-left text-lg text-oliveGreen font-bold mb-2">
                  Offer Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-softBeige rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveGreen"
                  required
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-left text-lg text-oliveGreen font-bold mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border border-softBeige rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveGreen"
                  rows={3}
                />
              </div>

              {/* Discount */}
              <div className="mb-4">
                <label className="block text-left text-lg text-oliveGreen font-bold mb-2">
                  Discount Percentage
                </label>
                <input
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  className="w-full p-2 border border-softBeige rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveGreen"
                  min="0"
                  max="100"
                  required
                />
                {errors.discountPercentage && (
                  <p className="text-red-500 text-sm mt-1">{errors.discountPercentage}</p>
                )}
              </div>

              {/* Valid From */}
              <div className="mb-4">
                <label className="block text-left text-lg text-oliveGreen font-bold mb-2">
                  Valid From
                </label>
                <input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="w-full p-2 border border-softBeige rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveGreen"
                  required
                />
                {errors.validFrom && <p className="text-red-500 text-sm mt-1">{errors.validFrom}</p>}
              </div>

              {/* Valid Till */}
              <div className="mb-6">
                <label className="block text-left text-lg text-oliveGreen font-bold mb-2">
                  Valid Till
                </label>
                <input
                  type="date"
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                  className="w-full p-2 border border-softBeige rounded-lg focus:outline-none focus:ring-2 focus:ring-oliveGreen"
                  required
                />
                {errors.validTill && <p className="text-red-500 text-sm mt-1">{errors.validTill}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-darkGreen text-white py-4 rounded-xl hover:bg-oliveGreen transition text-2xl font-kalnia"
              >
                Update Offer
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}