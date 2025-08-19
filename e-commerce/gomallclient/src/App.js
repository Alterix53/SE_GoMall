import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Cart from './Component/Cart/Cart';
import Checkout from './Component/Checkout/Checkout';
import CategoryList from './Component/Category/CategoryList';
//import Navbar from './Component/Navbar/Navbar'; bị dư rồi
import SearchResult from "./SearchResult";    // Minh
import SearchBar from './Component/SearchBar/SearchBar';    // Minh
import ProductCard from './Component/ProductCard/ProductCard';    // Minh
import Footer from './Component/Footer/Footer';
import UserSettings from './Component/UserPage/UserSetting';
// view item detail
import ViewItemDetail from './Component/viewItemDetail';
import ProductDetail from './Component/ProductDetail/ProductDetail';

// Import các component chính
import Home from './Home';
import FlashSale from './Flash_sale';
import TopProduct from './TopProduct';
import TodaySuggestions from './TodaySuggestions';

// Import các component Admin
import SidebarNav from './Component/Admin/SidebarNav';
import Breadcrumbs from './Component/Admin/Breadcrumbs';
import DashboardPage from './Component/Admin/pages/DashboardPage';
import ManageUserPage from './Component/Admin/pages/ManageUserPage';
import ManageSellerPage from './Component/Admin/pages/ManageSellerPage';
import ItemsPage from './Component/Admin/pages/ItemsPage';

// Import các component Auth
import LoginPage from './Component/Login/login';
import SignUpPage from './Component/Signup/signup';
import ForgotPassword from './Component/Login/ForgotPassword';
import ResetPassword from './Component/Login/ResetPassword';
import SellerDashboard from './Component/Sellerdashboard/Sellerdashboard';

// 
import UserPage from './Component/UserPage/UserPage';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';

// Import AuthContext
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from "./contexts/CartContext";

// seller
import Statistics from './Component/Sellerdashboard/Statistics';
import ShippingStatus from './Component/Sellerdashboard/ShippingStatus';
import OrderDetail from './Component/Sellerdashboard/OrderDetail';
import RegisterSeller from './Component/RegisterSeller/RegisterSeller';
import Navbar from './Component/Navbar/Navbar';
import Suggestions from './Component/Suggestions/Suggestions';

// Import Payment Result components
import PaymentSuccess from './Component/PaymentResult/PaymentSuccess';
import PaymentFailed from './Component/PaymentResult/PaymentFailed';
import PaymentCancelled from './Component/PaymentResult/PaymentCancelled';
import CashPaymentSuccess from './Component/PaymentResult/CashPaymentSuccess';

// Import Order and Invoice components
import OrderView from './Component/OrderView/OrderView';
import InvoiceDownload from './Component/InvoiceDownload/InvoiceDownload';

// Import Test components
import QRTest from './Component/MomoPayment/QRTest';


const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const hideLayout = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname);
  return (
    <>
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

function AdminLayout() {
  return (
    <div className="d-flex">
      <Navbar />
      <SidebarNav />
      <div className="flex-grow-1 p-3">
        <Breadcrumbs />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="ManageUser" element={<ManageUserPage />} />
          <Route path="ManageUser/User" element={<ManageUserPage />} />
          <Route path="ManageSeller" element={<ManageSellerPage />} />
          <Route path="Items" element={<ItemsPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <LayoutWrapper>
            <div className="App">
              {/* Sử dụng Navbar mới cho các trang chính */}
              <Routes>
                {/* Admin routes - sử dụng layout riêng */}
                <Route path="/Admin/*" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                } />
                
                {/* Auth routes - không có navbar */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signin" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                
                
                {/* User routes - có navbar và footer */}
                <Route path="/user" element={<UserPage />} />
                <Route path="/user/settings" element={<UserSettings />} />
                <Route path="/search" element={<SearchResult />} /> {/* Route cho tìm kiếm */}  {/* Minh */}
                
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                
                {/* Payment Result Routes */}
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/failed" element={<PaymentFailed />} />
                <Route path="/payment/cancelled" element={<PaymentCancelled />} />
                <Route path="/payment/cash-success" element={<CashPaymentSuccess />} />
                
                {/* Order and Invoice Routes */}
                <Route path="/orders" element={<OrderView />} />
                <Route path="/invoice" element={<InvoiceDownload />} />
                
                {/* Test Routes */}
                <Route path="/qr-test" element={<QRTest />} />
                {/* SELLER ROUTES - có thể có layout riêng */}
                <Route path="/seller" element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/seller/statistics" element={
                  <ProtectedRoute requiredRole="seller">
                    <Statistics />
                  </ProtectedRoute>
                } />
                <Route path="/seller/orders" element={
                  <ProtectedRoute requiredRole="seller">
                    <ShippingStatus />
                  </ProtectedRoute>
                } />
                <Route path="/seller/orders/:id" element={
                  <ProtectedRoute requiredRole="seller">
                    <OrderDetail />
                  </ProtectedRoute>
                } />
                
                {/* Main routes - sử dụng Navbar và Footer */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/flash-sale" element={<FlashSale />} />
                <Route path="/top-products" element={<TopProduct />} />
                <Route path="/today-suggestions" element={<TodaySuggestions />} />
                <Route path="/suggestions" element={<Suggestions />} />
                <Route path="/register-seller" element={<RegisterSeller />} />
                
                {/* Category routes - sử dụng Navbar và Footer */}
                <Route path="/category/*" element={<CategoryList />} />
                
                {/* Fallback route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </LayoutWrapper>
        </Router>
      </CartProvider>
    </AuthProvider>

  );
}

export default App;
