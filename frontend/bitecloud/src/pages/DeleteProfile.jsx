import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DeleteProfile = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete("/api/users/delete", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      localStorage.removeItem("token");
      alert("Your account has been deleted.");
      navigate("/register");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('/images/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />

      <div className="flex-grow flex justify-center items-center p-6">
        <div className="bg-[#FFFDF5] shadow-md rounded-2xl p-8 w-full max-w-md text-[#103713] text-center border-2 border-darkGreen border-700">
          <h2 className="text-4xl font-bold mb-8 font-[Kalnia]">
            Delete Account
          </h2>
          <p className="mb-6 text-[#375615]">
            Are you sure you want to delete your profile? This action is{" "}
            <strong>permanent</strong> and cannot be undone.
          </p>

          <div className="flex justify-between gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 w-full border-2 border-darkGreen border-700"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 w-full border-2 border-black border-700"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeleteProfile;