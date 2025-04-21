import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function RateOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/orders/rate", {
        orderId,
        rating,
        review,
      });
      navigate("/customer/dashboard"); // success route
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit rating");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-softBeige px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-offWhite p-6 rounded-2xl shadow-md w-full max-w-2xl border-2 border-green-700"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-lime-500 to-green-800 bg-clip-text text-transparent font-kalnia text-center mb-6">
          Rate Your Order
        </h2>

        <div className="mb-4">
          <label className="block text-lg text-oliveGreen font-bold mb-2">
            Rating (1 to 5)
          </label>
          <select
            value={rating}
            onChange={(e) => {
              setRating(parseInt(e.target.value));
              setError("");
            }}
            className="w-full p-2 border border-softBeige rounded-lg focus:ring-2 focus:ring-oliveGreen"
          >
            <option value="">Select a rating</option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-lg text-oliveGreen font-bold mb-2">
            Review (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            placeholder="Write your thoughts here..."
            className="w-full p-2 border border-softBeige rounded-lg focus:ring-2 focus:ring-oliveGreen"
          />
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-darkGreen text-white py-3 rounded-xl hover:bg-oliveGreen transition text-lg font-[Kalnia]"
        >
          Submit Rating
        </button>
      </form>
    </div>
  );
}
