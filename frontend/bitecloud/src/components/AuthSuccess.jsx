import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";


export default function AuthSuccess() {
    const navigate = useNavigate();
  

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      console.log("Token:", token);

      // Decode the token to extract the role
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.role; // Get the role from the decoded token

      console.log("Decoded Role:", userRole);
      console.log("Navigating to:", `/customer/dashboard`);

      // Redirect based on the user's role
      if (userRole === "Customer") {
        console.log("yes, user role is customer")
        setTimeout(() => {
            navigate("/customer/dashboard");
          }, 100);
          
        //navigate("/customer/dashboard");
      } else if (userRole === "RestaurantAdmin") {
        navigate("/restaurant-admin/dashboard");
      } else if (userRole === "DeliveryPersonnel") {
        navigate("/delivery-personnel/dashboard");
      } else {
        navigate("/register");  // Default to register if no matching role
      }

    } else {
      navigate("/register");  // Redirect to register page if no token
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
}
