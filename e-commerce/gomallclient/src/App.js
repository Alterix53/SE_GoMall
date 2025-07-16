import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Component/Login/login';
import SignUpPage from './Component/Signup/signup'; 
import SellerDashboard from './Component/Sellerdashboard/Sellerdashboard';
import Navbar from './Component/Navbar/Navbar';
import Footer from './Component/Footer/Footer';
import Statistics from './Component/Sellerdashboard/Statistics';
import ShippingStatus from './Component/Sellerdashboard/ShippingStatus';
import OrderDetail from './Component/Sellerdashboard/OrderDetail';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/statistics" element={<Statistics />} />
        <Route path="/seller/orders" element={<ShippingStatus />} />
        <Route path="/seller/orders/:id" element={<OrderDetail />} />
        {/* Có thể thêm Home nếu muốn */}
      </Routes>
    </Router>
  );
}

export default App;
