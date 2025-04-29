import React, { useEffect, useState } from "react";
import { FaStar, FaMedal } from "react-icons/fa";
import axios from "axios";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

/*<div className="bg-[#F2EBE3] rounded-xl p-4 shadow border-4 border-darkGreen">
                <h2 className="font-bold text-xl mb-2 font-[Kalnia] text-center">
                  ⭐ Recommended
                </h2>
                {recommendations.length > 0 ? (
                  recommendations.map((rec) => <p key={rec._id}>{rec.name}</p>)
                ) : (
                  <p>No recommendations yet.</p>
                )}
              </div>*/

const CustomerDashboard = () => {
  const [user, setUser] = useState({
    name: "",
    membershipTier: "",
    loyaltyPoints: 0,
    averageRating: 0,
  });
  const [averageRating, setAverageRating] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [trivia, setTrivia] = useState("");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const customerId = localStorage.getItem("userId");

  const fetchTrivia = async () => {
    try {
      const triviaRes = await axios
        .get(`https://api.spoonacular.com/food/trivia/random?apiKey=7016289a4bbd47f79b01674cc655b6fb`);
        
      setTrivia(triviaRes.data.text);
    } catch (err) {
      console.error("Error fetching trivia:", err);
      setTrivia("Couldn’t fetch a fun food fact right now. 🍽️");
    }
  };

  useEffect(() => {
    console.log("Fetching dashboard data...");
    const fetchData = async () => {
      try {
        const userRes = await axios.get(
          "http://localhost:5000/api/user/profile",
          config
        );
        setUser({
          name: userRes.data.name,
          membershipTier: userRes.data.membershipTier,
          loyaltyPoints: userRes.data.loyaltyPoints,
          averageRating: userRes.data.averageRatingGiven,
        });

        console.log("Fetching offers...");
        const offersRes = await axios.get(
          "http://localhost:5000/api/user/offers/top-5",
          config
        );
        console.log("Offers data:", offersRes.data);
        setOffers(offersRes.data.offers);

        //FAVORITES LOGIC
        console.log("Fetching favorites...");
        const favRes = await axios.get(
          "http://localhost:5000/api/user/favorites",
          config
        );
        setFavorites(favRes.data);
        console.log("Favorites data:", favRes.data);

        const orderRes = await axios.get(
          `http://localhost:5500/api/orders/history?customerId=${customerId}&limit=3`,
          config
        );
        setRecentOrders(orderRes.data.orders);

        //const recRes = await axios.get(
        //  "http://localhost:5500/api/orders/recommendations",
        //  config
        //);
        setRecommendations(recRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }

      fetchTrivia();
    };

    fetchData();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={i} className="text-yellow-500 inline" />
        ))}
        {halfStar && <FaStar className="text-yellow-300 inline" />}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
          <FaStar key={i} className="text-gray-300 inline" />
        ))}
      </>
    );
  };

  // Loyalty Progress Logic
  const getNextTierInfo = () => {
    const points = user.loyaltyPoints;
    if (points >= 500) return { next: null, remaining: 0, progress: 100 };
    if (points >= 200)
      return {
        next: "Gold",
        remaining: 500 - points,
        progress: Math.min(((points - 200) / (500 - 200)) * 100, 100),
      };
    return {
      next: "Silver",
      remaining: 200 - points,
      progress: Math.min((points / 200) * 100, 100),
    };
  };

  const { next, remaining, progress } = getNextTierInfo();

  return (
    <div
      className="flex"
      style={{
        backgroundImage: `url('/images/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Sidebar role="Customer" isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#F2EBE3] rounded-2xl p-6 shadow-md text-center mb-6 border-4 border-darkGreen">
              <h1 className="text-3xl font-bold font-[Kalnia]">
                Hi {user.name} 👋
              </h1>
              <p className="text-2xl mt-2 font-semibold text-[#628B35] flex justify-center items-center gap-2">
                <FaMedal className="text-yellow-500" /> {user.membershipTier}{" "}
                Member - {user.loyaltyPoints} pts
              </p>

              <div className="mt-3 flex justify-center items-center gap-2 text-xl text-[#6F4D38]  font-bold font-[Kalnia]">
                <span>Your Avg Rating:</span> {renderStars(user.averageRating)}
                <span className="ml-2">({user.averageRating?.toFixed(1)})</span>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-6 mb-8">
              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow border-4 border-darkGreen">
                <h2 className="font-bold text-xl mb-2 font-[Kalnia] text-center">
                  📊 Loyalty Progress
                </h2>
                <p className="text-[#6F4D38] text-lg font-semibold mb-1">
                  {next
                    ? `${remaining} more points to reach ${next} Tier!`
                    : `🎉 You've hit the top Gold Tier!`}
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden mb-2">
                  <div
                    className="bg-green-600 h-full transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-[#6F4D38] ">
                  Current Progress: {progress.toFixed(0)}%
                </p>
              </div>

              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow border-4 border-darkGreen">
                <h2 className="font-bold text-xl mb-2 font-[Kalnia] text-center">
                  📦 Recent Orders
                </h2>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order._id} className="mb-2 border-b pb-2">
                      <p className="text-sm">
                        #{order._id.slice(-6)} —{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium">
                        Total: ${order.totalPrice.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs ${
                          order.status === "Delivered"
                            ? "text-green-600"
                            : order.status === "Canceled"
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No recent orders yet.</p>
                )}
              </div>

              {/* TRACK DELIVERY LINK GOES INSIDE HERE*/}

              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow border-4 border-darkGreen">
                <h2 className="font-bold text-xl mb-2 font-[Kalnia] text-center">
                  🚚 Track Your Delivery
                </h2>
                
                {/*ADD THE CORRECT LINK HERE*/}
                <button
                  onClick={() => navigate("/track-delivery/yourOrderIdHere")} 
                  className="bg-darkGreen text-[#FFFDF5] px-4 py-2 rounded-lg mt-4 w-full hover:bg-oliveGreen transition duration-300"
                >
                  Track Delivery
                </button>
              </div>

              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow border-4 border-darkGreen">
                <h2 className="font-bold text-xl mb-2 font-[Kalnia] text-center">
                  🎁 Ongoing Offers
                </h2>
                {Array.isArray(offers) && offers.length > 0 ? (
                  <ul className="space-y-2">
                    {offers.map((offer) => (
                      <li
                        key={offer._id}
                        className="p-2 bg-white rounded-lg shadow-sm"
                      >
                        <h3 className="font-bold text-[#628B35]">
                          {offer.title}
                        </h3>
                        <p className="text-[#6F4D38]">{offer.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">
                    No ongoing offers at the moment.
                  </p>
                )}
              </div>

              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow border-4 border-darkGreen">
                <h2 className="font-bold text-xl mb-2 font-[Kalnia] text-center">
                  ❤️Your Favorites
                </h2>
                {favorites.length === 0 ? (
                  <p className="text-slateGray">
                    You haven't favorited any restaurants yet.
                  </p>
                ) : (
                  <ul>
                    {favorites.map((fav) => (
                      <a
                        key={fav.restaurantId}
                        href={`/customer/restaurants/${fav.restaurantId}/menu`}
                        className="block text-darkGreen text-xl hover:underline mb-1  bg-white rounded-lg shadow-sm p-3"
                      >
                        <p className="font-bold"> 🍽️ {fav.restaurantName}</p>
                      </a>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-[#F2EBE3] rounded-xl p-4 shadow border-4 border-darkGreen">
                <h2 className="font-bold text-xl mb-2 font-[Kalnia] text-center">
                  🍽️ Fun Food Fact
                </h2>
                <p className="mb-3">
                  {trivia || "Fetching a tasty fact for you..."}
                </p>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={fetchTrivia}
                    className="bg-[#628B35] text-white px-3 py-1 rounded hover:bg-[#4d6e29] transition font-[Kalnia] font-bold border-2 border-darkGreen"
                  >
                    New Fun Fact 🍳
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default CustomerDashboard;
