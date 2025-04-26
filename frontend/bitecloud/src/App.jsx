import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login"; // <-- Correct path to your Login.jsx component
import RegisterForm from './components/RegisterForm';
import DeleteProfile from "./pages/DeleteProfile";
import EditProfile from "./pages/EditProfile";
import ViewProfile from "./pages/ViewProfile";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import RestaurantList from './pages/RestaurantList'
import MenuPage from './pages/MenuPage' 
import RestaurantAdminDashboard from "./pages/dashboards/RestaurantAdminDashboard"
import RestaurantDetailDashboard from "./pages/dashboards/RestaurantDetailDashboard"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/delete" element={<DeleteProfile />} />
        <Route path="/edit" element={<EditProfile />} />
        <Route path="/profile" element={<ViewProfile />} />
        {/* Dashboards for each user role */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />

        <Route path="/customer/restaurants" element={<RestaurantList />} />
        <Route path="/customer/restaurants/:restaurantId/menu" element={<MenuPage />} />

        {/* Dashboards for restaurant admin role */}
        <Route path="/restaurant/dashboard" element={<RestaurantAdminDashboard />} />
        <Route path="/restaurant/dashboard/:restaurantId" element={<RestaurantDetailDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;