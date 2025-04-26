import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartPage from './pages/CartPage';

function App() {

  return (
    <Router>
      <Routes>
        <Route path ="/" element ={<CartPage />} />
      </Routes>
    </Router>
  );

}

export default App;
