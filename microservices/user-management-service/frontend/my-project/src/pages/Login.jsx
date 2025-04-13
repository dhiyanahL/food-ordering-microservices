import LoginForm from "../components/LoginForm";
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

      // Redirect based on role
      switch (user.role) {
        case "Customer":
          navigate("/customer/dashboard");
          break;
        case "DeliveryPersonnel":
          navigate("/delivery/dashboard");
          break;
        case "RestaurantAdmin":
          navigate("/restaurant/dashboard");
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
    <div className="min-h-screen flex items-center justify-center bg-softBeige">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}
