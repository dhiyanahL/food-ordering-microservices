import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Footer from "./Footer"; // 🟢 import Footer here

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "Customer",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      navigate("/");
    } catch (error) {
      console.error(error.response?.data?.message || "Registration failed");
    }
  };

  const showAddress = formData.role === "Customer" || formData.role === "RestaurantAdmin";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-emerald-700 via-lime-600 to-green-800 px-4">
      <div className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-offWhite p-6 rounded-2xl shadow-md w-full max-w-3xl border-2 border-green-700"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-emerald-700 via-lime-500 to-green-800 bg-clip-text text-transparent font-kalnia text-center mb-4">
            BiteCloud
          </h2>

          {/* First Row - Name & Email */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full">
              <label className="block text-lg mb-2 text-oliveGreen font-bold">Name</label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-softBeige rounded-lg focus:ring-2 focus:ring-oliveGreen"
              />
            </div>
            <div className="w-full">
              <label className="block text-lg mb-2 text-oliveGreen font-bold">Email</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-softBeige rounded-lg focus:ring-2 focus:ring-oliveGreen"
              />
            </div>
          </div>

          {/* Second Row - Phone & Password */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full">
              <label className="block text-lg mb-2 text-oliveGreen font-bold">Phone Number</label>
              <input
                name="phoneNumber"
                type="text"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border border-softBeige rounded-lg focus:ring-2 focus:ring-oliveGreen"
              />
              {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>
            <div className="w-full">
              <label className="block text-lg mb-2 text-oliveGreen font-bold">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-softBeige rounded-lg focus:ring-2 focus:ring-oliveGreen"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
                >
                  {showPassword ? <AiFillEye size={20} /> : <AiFillEyeInvisible size={20} />}
                </span>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-lg mb-2 text-oliveGreen font-bold">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border border-softBeige rounded-lg focus:ring-2 focus:ring-oliveGreen"
            >
              <option value="Customer">Customer</option>
              <option value="RestaurantAdmin">RestaurantAdmin</option>
              <option value="DeliveryPersonnel">DeliveryPersonnel</option>
            </select>
          </div>

          {/* Address */}
          {showAddress && (
            <div className="mb-4">
              <label className="block text-lg mb-2 text-oliveGreen font-bold">Address</label>
              <input
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-softBeige rounded-lg focus:ring-2 focus:ring-oliveGreen"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-darkGreen text-white py-3 mt-2 rounded-xl hover:bg-oliveGreen transition text-lg font-[Kalnia]"
          >
            Register
          </button>

          {/* OAuth Buttons */}
          <div className="mt-6 text-center">
            <p className="mb-3 text-oliveGreen font-medium text-lg">Or register with</p>
            <div className="flex justify-center gap-4">
              <a
                href="http://localhost:5000/api/auth/google"
                className="flex items-center gap-2 border border-gray-300 px-5 py-2 rounded-lg bg-white hover:bg-gray-100 transition"
              >
                <FcGoogle size={20} /> Google
              </a>
              <a
                href="http://localhost:5000/api/auth/facebook"
                className="flex items-center gap-2 border border-gray-300 px-5 py-2 rounded-lg bg-white hover:bg-gray-100 transition text-blue-600"
              >
                <FaFacebook size={20} /> Facebook
              </a>
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
