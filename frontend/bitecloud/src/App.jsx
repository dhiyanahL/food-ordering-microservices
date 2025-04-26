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
import AddOfferForm from './pages/AddOfferForm'
import AvailableOffers from './pages/AvailableOffers'
import EditOfferForm from "./pages/EditOffer";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import StripePayment from "./pages/dashboards/CheckoutForm";
import CartPage from "./pages/CartPage";  
import OrderHistoryPage from "./pages/OrderHistory";
import CheckoutPage from "./pages/CheckoutPage";
import DeliveryTrackerPage from "./pages/DeliveryTrackerPage";


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
        
        {/* Dashboards for admin role */}
        <Route path="/admin/add-offer" element={<AddOfferForm />} />
        <Route path="/admin/available-offers" element={<AvailableOffers />} />
        <Route path="/admin/edit-offer/:id" element={<EditOfferForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />


        {/* Dashboards for restaurant admin role */}
        <Route path="/restaurant/dashboard" element={<RestaurantAdminDashboard />} />
        <Route path="/restaurant/dashboard/:restaurantId" element={<RestaurantDetailDashboard />} />

        {/*Payment Gateway  */}

        <Route path="/payment/checkout" element = {<StripePayment/>}/>
        

        {/* Order history and checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/customer/orders" element={<OrderHistoryPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/delivery/:orderId" element={<DeliveryTrackerPage />} />
        
        

        {/* Order history and checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/customer/orders" element={<OrderHistoryPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/delivery/:orderId" element={<DeliveryTrackerPage />} />
        
        
      </Routes>
    </Router>
  );
}

export default App;