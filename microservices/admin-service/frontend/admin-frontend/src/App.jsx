
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddOfferForm from './pages/AddOfferForm'
import AvailableOffers from './pages/AvailableOffers'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddOfferForm />} />
        <Route path="/available-offers" element={<AvailableOffers />} />
      </Routes>
    </Router>
  )
}

export default App
