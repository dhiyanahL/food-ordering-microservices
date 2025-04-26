import LoginForm from "../components/LoginForm";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      //ROLE BASED DASHBOARD REDIRECT
      // Redirect based on role - DASHBOARD REDIRECT 
      switch (user.role) {
        case "Customer":
          navigate("/customer/dashboard");
          break;
        case "DeliveryPersonnel":
          navigate("/delivery-personnel/dashboard");
          break;
        case "RestaurantAdmin":
          navigate("/restaurant-admin/dashboard");
          break;
        case "Admin":
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      //alert("Login failed: " + err.response?.data?.message || err.message);
      console.error("Error during login:", err);
      alert("Login failed: " + (err.response?.data?.message || err.message || "Unknown error"));
  
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-700 via-lime-600 to-green-800">
    <div className="flex-grow flex items-center justify-center">
      <LoginForm onLogin={handleLogin} />
    </div>
    <Footer />
  </div>
    
  );
}