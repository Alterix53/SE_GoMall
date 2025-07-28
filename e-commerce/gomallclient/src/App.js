import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './Component/Login/login';
import SignUpPage from './Component/Signup/signup';
import SellerDashboard from './Component/Sellerdashboard/Sellerdashboard';
import Statistics from './Component/Sellerdashboard/Statistics';
import ShippingStatus from './Component/Sellerdashboard/ShippingStatus';
import OrderDetail from './Component/Sellerdashboard/OrderDetail';
import RegisterSeller from './Component/RegisterSeller/RegisterSeller';
import Navbar from './Component/Navbar/Navbar';
import Footer from './Component/Footer/Footer';

// Wrapper để ẩn Navbar/Footer trên 1 số trang như /login và /signup
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const hideLayout = ['/login', '/signup'].includes(location.pathname);
  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/register-seller" element={<RegisterSeller />} />
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/statistics" element={<Statistics />} />
          <Route path="/seller/orders" element={<ShippingStatus />} />
          <Route path="/seller/orders/:id" element={<OrderDetail />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
