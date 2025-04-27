import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoutes";
import Login from "./pages/Login"; // <-- Correct path to your Login.jsx component
import RegisterForm from "./components/RegisterForm";
import DeleteProfile from "./pages/DeleteProfile";
import EditProfile from "./pages/EditProfile";
import ViewProfile from "./pages/ViewProfile";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import RestaurantList from "./pages/RestaurantList";
import MenuPage from "./pages/MenuPage";
import RestaurantAdminDashboard from "./pages/dashboards/RestaurantAdminDashboard";
import RestaurantDetailDashboard from "./pages/dashboards/RestaurantDetailDashboard";
import AddOfferForm from "./pages/AddOfferForm";
import AvailableOffers from "./pages/AvailableOffers";
import EditOfferForm from "./pages/EditOffer";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import StripePayment from "./pages/CheckoutForm";
import NotificationComponent from "./pages/NotificationComponent";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import DeliveryTrackerPage from "./pages/DeliveryTrackerPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

//{/* Dashboards for each user role */}
//<Route path="/customer/dashboard" element={<CustomerDashboard />} />
/* <Route
          element={<ProtectedRoute allowedRoles={["DeliveryPersonnel"]} />}>
          <Route path="/delivery-personnel/dashboard" element={<DeliveryPersonnelDashboard />}/>
        </Route>*/

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/delete" element={<DeleteProfile />} />
        <Route path="/edit" element={<EditProfile />} />
        <Route path="/profile" element={<ViewProfile />} />

        {/* Customer Allowed Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Customer"]} />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/restaurants" element={<RestaurantList />} />
          <Route path="/customer/restaurants/:restaurantId/menu"element={<MenuPage />}/>
          <Route path="/customer/orders" element={<OrderHistoryPage />} />
        </Route>

        {/* Restaurant Admin Allowed Routes */}
        <Route element={<ProtectedRoute allowedRoles={["RestaurantAdmin"]} />}>
          <Route path="/restaurant/dashboard"element={<RestaurantAdminDashboard />}/>
          <Route path="/restaurant/dashboard/:restaurantId"element={<RestaurantDetailDashboard />}/>
        </Route>

        {/* Dashboards for admin role */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin/add-offer" element={<AddOfferForm />} />
          <Route path="/admin/available-offers" element={<AvailableOffers />} />
          <Route path="/admin/edit-offer/:id" element={<EditOfferForm />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
          {/* Cart and Checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/delivery-tracker/:orderId" element={<DeliveryTrackerPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />


        {/* Dashboards for restaurant admin role */}
        <Route path="/restaurant/dashboard" element={<RestaurantAdminDashboard />} />
        <Route path="/restaurant/dashboard/:restaurantId" element={<RestaurantDetailDashboard />} />

        <Route path ="/payment/checkout" element = {<StripePayment/>}/>
        
        <Route path="/notification/viewNotification" element = {<NotificationComponent/>}/>
      </Routes>
      <ToastContainer autoClose={1500} />
    </Router>
  );
}

export default App;
