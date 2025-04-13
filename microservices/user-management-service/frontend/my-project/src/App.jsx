import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // <-- Correct path to your Login.jsx component
import RegisterForm from './components/RegisterForm';

import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import RestaurantAdminDashboard from "./pages/dashboards/RestaurantAdminDashboard";
import DeliveryPersonnelDashboard from "./pages/dashboards/DeliveryPersonnelDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        {/* Dashboards for each user role */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/restaurant/dashboard" element={<RestaurantAdminDashboard />} />
        <Route path="/delivery/dashboard" element={<DeliveryPersonnelDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
