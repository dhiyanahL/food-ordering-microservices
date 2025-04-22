import { useEffect, useState } from "react";
import axios from "axios";

export default function AvailableOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchOffers();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-offWhite px-4">
      <div className="w-full max-w-6xl bg-white p-6 rounded-2xl shadow-md border-2 border-oliveGreen">
        <h2 className="text-4xl font-bold mb-6 text-center text-darkGreen font-kalnia">
          Available Offers
        </h2>

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
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-[#f7f9f5] transition duration-200">
                    <td className="py-3 px-4 border border-softBeige text-center">{offer.title}</td>
                    <td className="py-3 px-4 border border-softBeige text-center ">{offer.description || "-"}</td>
                    <td className="py-3 px-4 border border-softBeige text-center">{offer.discountPercentage}%</td>
                    <td className="py-3 px-4 border border-softBeige text-center">{new Date(offer.validFrom).toLocaleDateString()}</td>
                    <td className="py-3 px-4 border border-softBeige text-center">{new Date(offer.validTill).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
