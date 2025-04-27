
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddOfferForm from './pages/AddOfferForm'
import AvailableOffers from './pages/AvailableOffers'
import EditOfferForm from "./pages/EditOffer";
import './App.css'
import AdminDashboard from "./pages/AdminDashboard";

//<Route path="/" element={<AdminDashboard />} />
//<Route path="/available-offers" element={<AvailableOffers />} />

function App() {
  return (
    <Router>
      <Routes>
      
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/add-offer" element={<AddOfferForm />} />
        <Route path="/available-offers" element={<AvailableOffers />} />
        <Route path="/edit-offer/:id" element={<EditOfferForm />} />
      </Routes>
    </Router>
  )
}

export default App
